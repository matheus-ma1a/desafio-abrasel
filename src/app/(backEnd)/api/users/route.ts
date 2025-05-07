import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/app/(backEnd)/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/(backEnd)/lib/auth";


export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }
  
  try {
    const users = await prisma.user.findMany({
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
    
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar usuários" }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const { name, email, password, cep, state, city } = await request.json();
    
    // Validações básicas
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Campos obrigatórios não preenchidos" }, { status: 400 });
    }
    

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 409 });
    }
    

    const hashedPassword = await bcrypt.hash(password, 10);
    

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        cep,
        state,
        city
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });
    
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return NextResponse.json({ error: "Erro ao cadastrar usuário" }, { status: 500 });
  }
}