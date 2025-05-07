import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth/next'
import Link from 'next/link'
import NextAuthProvider from '../providers/NextAuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Gerenciamento de Usuários',
  description: 'Sistema de gerenciamento de usuários com Next.js e Prisma',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession();
  
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <NextAuthProvider>
          <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between">
              <Link href="/" className="font-bold text-xl">
                Gerenciamento de Usuários
              </Link>
              <div className="space-x-4">
                {session ? (
                  <>
                    <Link href="/dashboard">Dashboard</Link>
                    {session.user.role === 'admin' && (
                      <Link href="/admin">Admin</Link>
                    )}
                    <Link href="/api/auth/signout">Sair</Link>
                  </>
                ) : (
                  <>
                    <Link href="/login">Login</Link>
                    <Link href="/register">Cadastro</Link>
                  </>
                )}
              </div>
            </div>
          </nav>
          <main className="container mx-auto p-4">
            {children}
          </main>
        </NextAuthProvider>
      </body>
    </html>
  )
}