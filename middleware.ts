import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Rotas públicas
  const publicPaths = ["/", "/login", "/register"];
  const isPublicPath = publicPaths.some(pp => path === pp);
  
  // Rotas de admin
  const isAdminPath = path.startsWith("/admin");
  
  // Verificar token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  // Redirecionar usuário não autenticado para login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  // Verificar permissões de admin
  if (isAdminPath && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  // Redirecionar usuário autenticado para dashboard
  if (isPublicPath && token && path !== "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/users/:path*",
  ],
};