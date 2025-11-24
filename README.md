# 7barra7 Backend

## Stack

### Express

- Framework usado para criar rotas, middlewares e serviços HTTP.
- https://expressjs.com/

### Cors

- Middleware que controla e libera o acesso entre diferentes domínios (ex.: frontend ↔ backend).
  Usado para evitar erros de CORS Policy.
- https://expressjs.com/en/resources/middleware/cors.html?utm_source=chatgpt.com

### Helmet

- Middleware de segurança que ajusta automaticamente headers HTTP, ajudando a proteger contra ataques comuns como XSS, clickjacking e injeções.
- https://expressjs.com/en/advanced/best-practice-security.html?utm_source=chatgpt.com

### Morgan

- Middleware para geração de logs HTTP, útil durante o desenvolvimento e depuração.
- https://www.npmjs.com/package/morgan

### Dotenv

- Carrega variáveis de ambiente a partir de um arquivo .env, evitando expor dados sensíveis no código.
- https://www.dotenv.org/

### ESlint

- Ferramenta de análise que aponta erros e inconsistências no código, padronizando a aplicação.
- https://eslint.org/

### Prettier

- Formatação automática do código, usado em conjunto com o ESlint para manter a qualidade do código.
- https://prettier.io/

### Prisma 
- É um ORM (Object-Relational Mapping) responsável pela comunicação entre o código e o banco de dados, através de models que geram as tabelas.
- https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/postgresql
