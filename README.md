# marketplace-starter-ts

Create .env file:

```bash
cp .env.example .env
```

Install dependencies:

```bash
bun install
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
