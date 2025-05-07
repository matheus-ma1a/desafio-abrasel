# Aplicação de Gerenciamento de Usuários

Este é um projeto fullstack de gerenciamento de usuários desenvolvido com Next.js, Prisma e SQLite, oferecendo uma solução completa para autenticação e gerenciamento de usuários.

## Funcionalidades Principais

### Autenticação
- Sistema de registro de novos usuários
- Login seguro com NextAuth.js
- Proteção de rotas baseada em autenticação
- Gerenciamento de sessões

### Área do Usuário
- Dashboard personalizado para cada usuário
- Visualização dos dados pessoais
- Edição de informações do perfil
- Gerenciamento de endereço com integração automática via API de CEP

### Área Administrativa
- Painel administrativo protegido
- Listagem completa de usuários
- Gerenciamento de usuários (CRUD)
- Controle de permissões
- Administrador preconfigurado 
  - use para logar 
  - email: admin@example.com
  - senha: admin@example.com

### Recursos Técnicos
- API RESTful para operações de usuários
- Integração com serviço de CEP para autopreenchimento de endereços
- Armazenamento seguro de senhas com bcryptjs
- Banco de dados relacional com Prisma ORM

## Stack Tecnológica

- **Frontend:**
  - Next.js 14 com App Router
  - React 18
  - TailwindCSS para estilização
  - Axios para requisições HTTP

- **Backend:**
  - API Routes do Next.js
  - Prisma ORM
  - SQLite como banco de dados
  - NextAuth.js para autenticação

## Pré-requisitos

- Node.js 18.0 ou superior
- npm ou yarn
- Git

## Como Iniciar

1. Clone o repositório:
   ```bash
   git clone https://github.com/matheus-ma1a/desafio-abrasel.git
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```
   Preencha as variáveis necessárias no arquivo .env

4. Execute as migrações do banco de dados:
   ```bash
   npx prisma migrate dev
   
5. Execute o comando a baixo para popular o banco com o acesso de admin:
   ```bash
   npx prisma db seed
   ```

6. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

7. Acesse a aplicação em `http://localhost:3000`

## Estrutura de Rotas

- `/` - Página inicial
- `/login` - Página de login
- `/register` - Página de registro
- `/dashboard` - Área do usuário
- `/admin` - Painel administrativo
  - use para logar 
    - email: admin@example.com
    - senha: admin@example.com


## Contato

Matheus Maia - [matheussantosmaia@gmail.com]

Link do Projeto: [https://github.com/matheus-ma1a/desafio-abrasel.git](https://github.com/matheus-ma1a/desafio-abrasel.git)