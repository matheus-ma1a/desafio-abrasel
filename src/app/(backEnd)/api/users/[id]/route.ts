import { NextResponse } from "next/server";
import prisma from "@/app/(backEnd)/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/(backEnd)/lib/auth";



export async function GET(request: Request, { params }: { params: { id: string } }) {

  const session = await getServerSession(authOptions);

  console.log('Usuário autenticado:', session?.user);
  console.log('ID solicitado:', params.id);

  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  // Verificar permissões (apenas admin pode ver qualquer usuário, usuário comum só pode ver o próprio perfil)
  if (Number(session.user.id) !== Number(params.id) && session.user.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(params.id) },
      select: {
        id: true,
        name: true,
        email: true,
        cep: true,
        state: true,
        city: true,
        role: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar usuário" }, { status: 500 });
  }
}


export async function PUT(request: Request, { params }: { params: { id: string } }) {

  const session = await getServerSession(authOptions);

  console.log('Usuário autenticado:', session?.user);
  console.log('ID solicitado:', params.id);

  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }


  if (session.user.id !== params.id && session.user.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  try {
    const { name, cep, state, city, role } = await request.json();


    if (!name) {
      return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
    }


    const updateData: any = {
      name,
      cep: cep || null,
      state: state || null,
      city: city || null
    };


    if (session.user.role === "admin" && role) {
      updateData.role = role;
    }


    const updatedUser = await prisma.user.update({
      where: { id: parseInt(params.id) },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        cep: true,
        state: true,
        city: true,
        role: true
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 });
  }
}


export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  console.log('Usuário autenticado:', session?.user);
  console.log('ID solicitado:', params.id);

  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  try {

    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // Prevenir que o último admin seja excluído
    if (user.role === "admin") {
      const adminCount = await prisma.user.count({
        where: { role: "admin" }
      });

      if (adminCount <= 1) {
        return NextResponse.json({
          error: "Não é possível excluir o último administrador"
        }, { status: 400 });
      }
    }


    await prisma.user.delete({
      where: { id: userId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao excluir usuário" }, { status: 500 });
  }
}