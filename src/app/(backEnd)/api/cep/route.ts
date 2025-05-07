import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cep = searchParams.get("cep");
  
  if (!cep) {
    return NextResponse.json({ error: "CEP não fornecido" }, { status: 400 });
  }
  
  try {
    const cleanCep = cep.replace(/\D/g, "");
    
    if (cleanCep.length !== 8) {
      return NextResponse.json({ error: "CEP inválido" }, { status: 400 });
    }
    
    const response = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`);
    
    if (response.data.erro) {
      return NextResponse.json({ error: "CEP não encontrado" }, { status: 404 });
    }
    
    return NextResponse.json({
      cep: response.data.cep,
      state: response.data.uf,
      city: response.data.localidade
    });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar CEP" }, { status: 500 });
  }
}