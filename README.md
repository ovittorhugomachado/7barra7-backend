# 7barra7 Backend

## Stack

### Express

Framework usado para criar rotas, middlewares e serviços HTTP.

- https://expressjs.com/

### Cors

Middleware que controla e libera o acesso entre diferentes domínios (ex.: frontend ↔ backend).
Usado para evitar erros de CORS Policy.

- https://expressjs.com/en/resources/middleware/cors.html?utm_source=chatgpt.com

### Helmet

Middleware de segurança que ajusta automaticamente headers HTTP, ajudando a proteger contra ataques comuns como XSS, clickjacking e injeções.

- https://expressjs.com/en/advanced/best-practice-security.html?utm_source=chatgpt.com

### Morgan

Middleware para geração de logs HTTP, útil durante o desenvolvimento e depuração.

- https://www.npmjs.com/package/morgan

### Dotenv

Carrega variáveis de ambiente a partir de um arquivo .env, evitando expor dados sensíveis no código.

- https://www.dotenv.org/

### ESlint

Ferramenta de análise que aponta erros e inconsistências no código, padronizando a aplicação.

- https://eslint.org/

### Prettier

Formatação automática do código, usado em conjunto com o ESlint para manter a qualidade do código.

- https://prettier.io/

### Prisma

É um ORM (Object-Relational Mapping) responsável pela comunicação entre o código e o banco de dados, através de models que geram as tabelas.

- https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/postgresql

### Jest

Biblioteca de testes unitários, onde é possível ver se a aplicação tem erros enquanto o códgio é alterado, com o jest watch

- https://jestjs.io/

### Redis

Banco de dados em memória usado para cache, sessões e armazenamento de dados temporários, oferece alta performance para operações de leitura/escrita.

- https://redis.io/

---

## Autenticação e segurança

Essa aplicação usa o JSON Web Tokens (JWT), pra gerenciar sessões dos usuários, criando 2 tokens, o AccessToken (15 minutos) e o RefreshToken (90 dias), essa abordagem permite que o usuário possa navegar pela aplicação sem precisar fazer o login constantemente, já que o token de longa duração gera um token de curta duração, que é o responsável por autorizar o acesso.

#### Access Token:

- **Finalidade:** Autorizar o acesso a rotas protegidas (recursos).

- **Expiração:** Curta (ex: 1 minuto - 1min).

- **Local de Envio:** Header Authorization como Bearer Token.

#### Refresh Token:

- **Finalidade:** Obter um novo Access Token quando o atual expirar.

- **Expiração:** Longa (ex: 90 dias - 90d).

- **Local de Armazenamento:** Cookie HTTP-only, secure e sameSite: strict.

#### Middleware de Autenticação (authenticateToken):

- É usado em rotas que fazer alterações e consultas ao banco de dados,
  **Fluxo do Middleware**
- **Consulta o accessToken** -> se for válido libera o acesso, se não ->
- **Consulta o accessToken** -> se for válido gera um novo accessToken, se não ->
- **Não autorizado. Tokens inválidos ou ausentes**

## Scripts

### dev

Inicia o servidor em modo de desenvolvimento

- Comando: `ts-node-dev --respawn --transpile-only src/server.ts`

### test

Executa todos os testes do projeto uma vez

- Comando: `jest`

### test:watch

Executa testes em modo watch (reativo)

- Comando: `jest --watch`

### test:coverage

Executa testes com relatório de cobertura de código

- Comando: `jest --coverage`

### test:redis

Executa apenas os testes específicos do Redis

- Comando: `jest src/tests/redis.test.ts`

### test:db

Executa apenas os testes específicos do banco de dados

- Comando: `jest src/tests/test-database.test.ts`

### check:lint

Verifica problemas de linting sem corrigir

- Comando: `eslint src`

### fix:lint

Corrige automaticamente problemas de linting

- Comando: `eslint src --fix`

### check:style

Verifica problemas de formatação do Prettier

- Comando: `prettier . --check`

### fix:style

Formata automaticamente todos os arquivos

- Comando: `prettier . --write`
