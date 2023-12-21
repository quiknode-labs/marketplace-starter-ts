# marketplace-starter-ts

Install bun

```bash
curl -fsSL https://bun.sh/install | bash # for macOS, Linux, and WSL
```

Create .env file:

```bash
cp .env.example .env
```

Install dependencies:

```bash
bun install
```

Create DB:

```psql
create user postgres with password 'postgres';
create database marketplace_starter_ts_dev;
grant all privileges on database marketplace_starter_ts_dev to postgres;
```

Generate DB bindings:

```bash
bun x prisma generate
```

Migrate DB:

```bash
bun migrate
```

Create new DB migration:

```bash
bunx prisma migrate dev --name nameofmigration
```

Run dev server:

```bash
bun dev
```

Lint code:

```bash
bun lint
```

This project was created using `bun init` in bun v1.0.1. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
