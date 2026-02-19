# 📝 Blog API — NestJS

Uma API RESTful para gerenciamento de blog construída com NestJS, TypeORM e
PostgreSQL. Implementa autenticação JWT, CRUD completo de usuários, posts e
comentários com relacionamentos e paginação.

## 🚀 Tecnologias

- **NestJS** + **TypeScript**
- **TypeORM** + **PostgreSQL**
- **Passport.js** + **JWT** (cookies HTTP-only)
- **bcrypt** · **class-validator** · **Docker**

---

## 🏗️ Arquitetura

```
src/
├── auth/          # Login, JWT Strategy, Guards
├── user/          # CRUD de usuários
├── posts/         # CRUD de posts com paginação
├── comments/      # CRUD de comentários com paginação
└── db/
    └── migrations/  # Migrações TypeORM
```

---

## ⚙️ Como rodar localmente

### Pré-requisitos

- Node.js >= 18.x
- Docker e Docker Compose

### 1. Clone e instale

```bash
git clone <url-do-repositorio>
cd blog
npm install
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=admin
DB_PASS=admin
DB_NAME=blog_database

JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRATION=1d

PORT=3000
```

> ⚠️ Nunca commite o `.env` com credenciais reais.

### 3. Suba o banco de dados

```bash
docker-compose up -d
```

### 4. Inicie a aplicação

```bash
# Desenvolvimento (hot reload)
npm run start:dev

# Produção
npm run build
npm run start:prod
```

As migrações rodam automaticamente no startup. A API estará em
`http://localhost:3000`.

---

## 📡 Endpoints

### 🔐 Auth

| Método | Rota          | Descrição                      |
| :----- | :------------ | :----------------------------- |
| `POST` | `/auth/login` | Login — retorna JWT via cookie |

### 👤 User

| Método   | Rota             | Auth    | Descrição         |
| :------- | :--------------- | :------ | :---------------- |
| `POST`   | `/user/create`   | público | Cadastrar usuário |
| `GET`    | `/user?email=`   | público | Buscar por email  |
| `PATCH`  | `/user/me`       | 🔒      | Atualizar perfil  |
| `PATCH`  | `/user/password` | 🔒      | Alterar senha     |
| `DELETE` | `/user/me`       | 🔒      | Deletar conta     |

### 📝 Posts

| Método   | Rota                    | Auth    | Descrição               |
| :------- | :---------------------- | :------ | :---------------------- |
| `GET`    | `/post?page=1&limit=10` | público | Listar posts publicados |
| `GET`    | `/post/:slug`           | público | Buscar por slug         |
| `POST`   | `/post/me`              | 🔒      | Criar post              |
| `GET`    | `/post/me`              | 🔒      | Meus posts              |
| `GET`    | `/post/me/:id`          | 🔒      | Meu post por ID         |
| `PATCH`  | `/post/me/:id`          | 🔒 dono | Editar post             |
| `DELETE` | `/post/me/:id`          | 🔒 dono | Deletar post            |

### 💬 Comments

| Método   | Rota                                     | Auth    | Descrição              |
| :------- | :--------------------------------------- | :------ | :--------------------- |
| `POST`   | `/comments/:postId`                      | 🔒      | Criar comentário       |
| `GET`    | `/comments/post/:postId?page=1&limit=10` | público | Comentários de um post |
| `GET`    | `/comments/me?page=1&limit=10`           | 🔒      | Meus comentários       |
| `GET`    | `/comments/:id`                          | público | Buscar por ID          |
| `PATCH`  | `/comments/:id`                          | 🔒 dono | Editar comentário      |
| `DELETE` | `/comments/:id`                          | 🔒 dono | Deletar comentário     |

> 🔒 = Requer `Authorization: Bearer <token>` ou cookie JWT

---

## 🗂️ Testando com Insomnia

Importe o arquivo `insomnia.yaml` na raiz do projeto. Configure as variáveis de
ambiente:

- `base_url`: `http://localhost:3000`
- `token`: cole o JWT retornado após o login

---

## 🔒 Segurança

- Senhas hasheadas com **bcrypt** (salt 10)
- JWT em **cookies HTTP-only**
- Validação de input com **class-validator** (`whitelist`,
  `forbidNonWhitelisted`)
- Campo `password` com `select: false` — nunca retornado nas queries
- Verificação de propriedade: apenas o **autor** pode editar/deletar posts e
  comentários
- `forceLogout` acionado ao mudar email ou senha

---

## 🗄️ Banco de Dados

### User

| Campo                 | Tipo           |
| :-------------------- | :------------- |
| id                    | UUID           |
| name                  | string         |
| email                 | string (único) |
| password              | string (hash)  |
| forceLogout           | boolean        |
| createdAt / updatedAt | Date           |

### Post

| Campo                 | Tipo    |
| :-------------------- | :------ |
| id                    | UUID    |
| title, slug (único)   | string  |
| content               | text    |
| excerpt               | string  |
| coverImageUrl         | string? |
| published             | boolean |
| author                | → User  |
| createdAt / updatedAt | Date    |

### Comment

| Campo                 | Tipo   |
| :-------------------- | :----- |
| id                    | UUID   |
| content               | string |
| author                | → User |
| post                  | → Post |
| createdAt / updatedAt | Date   |

---

## 🛠️ Scripts

```bash
npm run start:dev          # Modo watch
npm run build              # Compila o projeto
npm run start:prod         # Produção (requer build)
npm run lint               # ESLint
npm run test               # Testes unitários

# Migrações
npx typeorm-ts-node-commonjs -d ./data-source.ts migration:generate ./src/db/migrations/NomeDaMigration
npx typeorm-ts-node-commonjs -d ./data-source.ts migration:run
npx typeorm-ts-node-commonjs -d ./data-source.ts migration:revert
```

---

## 🐳 Docker

```bash
docker-compose up -d    # Sobe o PostgreSQL
docker-compose down     # Para o banco
docker-compose down -v  # Remove dados (cuidado!)
```

---

## 👤 Autor

**Diego** — [GitHub](https://github.com/JoaoTrindade1404)
