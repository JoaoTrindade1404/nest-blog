# 📝 Blog API - NestJS

> [!WARNING] **PROJETO EM DESENVOLVIMENTO** - Este projeto não está 100%
> concluído e está em fase de desenvolvimento ativo. Algumas funcionalidades
> podem estar incompletas ou em progresso.

Uma API RESTful robusta para gerenciamento de blog, construída com NestJS,
TypeORM e PostgreSQL. O projeto implementa autenticação JWT, gerenciamento de
usuários e sistema completo de posts.

## 🚦 Status Atual do Desenvolvimento

### ✅ O que está funcionando

- **Autenticação completa** - Sistema JWT com cookies HTTP-only, login e
  validações
- **Gestão de Usuários** - CRUD completo (criar, atualizar perfil, mudar senha,
  deletar)
- **Criação de Posts** - Usuários autenticados podem criar posts com todas as
  propriedades

### 🚧 Onde o projeto parou

- **CRUD de Posts incompleto** - Apenas CREATE está implementado
  - ❌ Falta: Listar posts (todos, por autor, por ID)
  - ❌ Falta: Atualizar posts
  - ❌ Falta: Deletar posts
  - ❌ Falta: Filtros e paginação
- **Sem testes** - Nenhum teste unitário ou E2E implementado ainda
- **Sem migrations** - Banco de dados criado manualmente via TypeORM sync
- **Features avançadas pendentes** - Comentários, tags, upload de imagens, etc.

## 🚀 Tecnologias

- **[NestJS](https://nestjs.com/)** - Framework Node.js progressivo
- **[TypeORM](https://typeorm.io/)** - ORM para TypeScript e JavaScript
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[JWT](https://jwt.io/)** - Autenticação baseada em tokens
- **[bcrypt](https://github.com/kelektiv/node.bcrypt.js)** - Hash de senhas
- **[class-validator](https://github.com/typestack/class-validator)** -
  Validação de DTOs
- **[Docker](https://www.docker.com/)** - Containerização do banco de dados

## 📋 Funcionalidades

### Autenticação

- ✅ Login com JWT
- ✅ Tokens armazenados em cookies HTTP-only
- ✅ Estratégia JWT com validação customizada
- ✅ Suporte a logout forçado (quando email/senha mudam)

### Gerenciamento de Usuários

- ✅ Criação de usuário com validação
- ✅ Atualização de perfil
- ✅ Alteração de senha com validações
- ✅ Exclusão de conta
- ✅ Busca de usuário por email
- ✅ Hash seguro de senhas com bcrypt

### Sistema de Posts

- ✅ Criação de posts com autor vinculado
- ✅ Sistema de slug único
- ✅ Suporte a imagem de capa
- ✅ Status de publicação
- ✅ Relacionamento com autor (User)

## 🏗️ Arquitetura

```
src/
├── auth/                    # Módulo de autenticação
│   ├── dto/                # DTOs de login
│   ├── guards/             # Guards JWT customizados
│   ├── types/              # Types e interfaces
│   ├── auth.controller.ts  # Endpoints de autenticação
│   ├── auth.service.ts     # Lógica de autenticação
│   ├── auth.module.ts      # Módulo de autenticação
│   └── jwt.strategy.ts     # Estratégia JWT do Passport
│
├── user/                   # Módulo de usuários
│   ├── dto/               # DTOs de usuário
│   ├── entities/          # Entidade User
│   ├── user.controller.ts # Endpoints de usuário
│   ├── user.service.ts    # Lógica de negócio de usuários
│   └── user.module.ts     # Módulo de usuários
│
├── posts/                 # Módulo de posts
│   ├── dto/              # DTOs de posts
│   ├── entities/         # Entidade Post
│   ├── post.controller.ts # Endpoints de posts
│   ├── post.service.ts   # Lógica de negócio de posts
│   └── post.module.ts    # Módulo de posts
│
├── common/               # Utilitários compartilhados
├── @types/              # Declarações de tipos globais
└── main.ts              # Ponto de entrada da aplicação
```

## 🔐 Modelo de Dados

### User (Usuário)

```typescript
{
  id: UUID
  name: string
  email: string (único)
  password: string (hash bcrypt)
  forceLogout: boolean
  createdAt: Date
  updatedAt: Date
  posts: Post[]
}
```

### Post (Publicação)

```typescript
{
  id: UUID;
  title: string;
  slug: string(único);
  content: text;
  excerpt: string;
  coverImageUrl: string | null;
  published: boolean;
  author: User;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🛠️ Configuração do Projeto

### Pré-requisitos

- Node.js >= 18.x
- Docker e Docker Compose
- PostgreSQL (via Docker)

### Instalação

1. **Clone o repositório**

```bash
git clone <url-do-repositorio>
cd blog
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
# Configurações do BD
DB_HOST=localhost
DB_PORT=5432
DB_USER=admin
DB_PASS=admin
DB_NAME=blog_database

# JWT Config
JWT_SECRET=sua_chave_secreta_super_segura_aqui
JWT_EXPIRATION=1d

# Porta da aplicação
PORT=3000
```

> ⚠️ **IMPORTANTE**: Nunca commite o arquivo `.env` com credenciais reais!

4. **Inicie o banco de dados com Docker**

```bash
docker-compose up -d
```

5. **Execute as migrations** (quando estiverem disponíveis)

```bash
npm run migration:run
```

6. **Inicie a aplicação**

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

A aplicação estará rodando em `http://localhost:3000`

## 📡 Endpoints da API

### Autenticação

#### `POST /auth/login`

Realiza login e retorna token JWT

**Body:**

```json
{
  "email": "user@example.com",
  "password": "senha123"
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "name": "Nome do Usuário",
    "email": "user@example.com"
  }
}
```

### Usuários

#### `POST /user/create`

Cria um novo usuário

**Body:**

```json
{
  "name": "Nome do Usuário",
  "email": "user@example.com",
  "password": "senha123"
}
```

#### `PATCH /user/me` 🔒

Atualiza dados do usuário autenticado

**Headers:** `Authorization: Bearer <token>` ou Cookie

**Body:**

```json
{
  "name": "Novo Nome",
  "email": "novoemail@example.com"
}
```

#### `PATCH /user/password` 🔒

Altera senha do usuário autenticado

**Headers:** `Authorization: Bearer <token>` ou Cookie

**Body:**

```json
{
  "currentPassword": "senhaAtual",
  "newPassword": "novaSenha123"
}
```

#### `DELETE /user/me` 🔒

Remove a conta do usuário autenticado

**Headers:** `Authorization: Bearer <token>` ou Cookie

#### `GET /user?email={email}`

Busca usuário por email

### Posts

#### `POST /post/me` 🔒

Cria um novo post vinculado ao usuário autenticado

**Headers:** `Authorization: Bearer <token>` ou Cookie

**Body:**

```json
{
  "title": "Título do Post",
  "slug": "titulo-do-post",
  "content": "Conteúdo completo do post...",
  "excerpt": "Resumo breve",
  "coverImageUrl": "https://example.com/image.jpg",
  "published": false
}
```

> 🔒 = Endpoint protegido (requer autenticação)

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev          # Inicia em modo watch
npm run start:debug        # Inicia com debugger

# Build
npm run build              # Compila o projeto

# Produção
npm run start:prod         # Executa versão compilada

# Qualidade de código
npm run lint               # Verifica lint
npm run format             # Formata código com Prettier

# Testes
npm run test               # Executa testes
npm run test:watch         # Testes em modo watch
npm run test:cov           # Testes com coverage
npm run test:e2e           # Testes end-to-end

# TypeORM Migrations
npm run migration:create --name=NomeDaMigration
npm run migration:generate --name=NomeDaMigration
npm run migration:run
npm run migration:revert
```

## 🐳 Docker

O projeto utiliza Docker Compose para o banco de dados PostgreSQL:

```bash
# Iniciar o banco de dados
docker-compose up -d

# Parar o banco de dados
docker-compose down

# Parar e remover volumes (CUIDADO: apaga os dados)
docker-compose down -v
```

Os dados são persistidos no diretório `./pgdata`.

## 🔒 Segurança

### Implementações de Segurança

- ✅ Senhas hasheadas com bcrypt (salt rounds: 10)
- ✅ Tokens JWT armazenados em cookies HTTP-only
- ✅ Validação de input em todos os endpoints (class-validator)
- ✅ Sanitização de dados (whitelist, forbidNonWhitelisted)
- ✅ Campos sensíveis excluídos por padrão (password com `select: false`)
- ✅ Logout forçado em alterações críticas (email/senha)
- ✅ Variáveis de ambiente para credenciais

### Boas Práticas

- Sempre use HTTPS em produção
- Configure CORS adequadamente
- Use secrets fortes para JWT_SECRET
- Implemente rate limiting em produção
- Adicione helmet para headers de segurança
- Configure logs adequados

## 🎯 Próximos Passos

Para completar o MVP do projeto, as próximas implementações seriam:

### Prioridade Alta

- [ ] **Completar CRUD de Posts**
  - [ ] GET `/posts` - Listar todos os posts publicados
  - [ ] GET `/posts/:id` - Buscar post por ID
  - [ ] GET `/posts/user/:userId` - Posts de um autor específico
  - [ ] PATCH `/posts/:id` - Atualizar post (apenas autor)
  - [ ] DELETE `/posts/:id` - Deletar post (apenas autor)
- [ ] **Paginação e Filtros** - Para listagem de posts
- [ ] **Testes E2E** - Cobertura básica dos principais fluxos

### Prioridade Média

- [ ] Sistema de categorias/tags
- [ ] Upload de imagens (coverImage)
- [ ] Refresh tokens
- [ ] Rate limiting
- [ ] Migrations organizadas

### Features Futuras

- [ ] Sistema de comentários
- [ ] Roles e permissões (admin, editor, author)
- [ ] Busca full-text
- [ ] Rascunhos e agendamento de posts

## 📝 Validações Implementadas

### User

- Email deve ser válido e único
- Senha mínima de 6 caracteres
- Nome é obrigatório
- Ao mudar email ou senha, `forceLogout` é acionado

### Post

- Título é obrigatório
- Slug deve ser único
- Content é obrigatório
- Excerpt é obrigatório
- Autor é vinculado automaticamente
