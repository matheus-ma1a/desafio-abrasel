import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string; // Adicionando a propriedade role
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: string; // Adicionando a propriedade role
  }

  interface JWT {
    id: string;
    role: string; // Adicionando a propriedade role
  }
}