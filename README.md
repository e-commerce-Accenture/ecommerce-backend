# NextGen E-Commerce Backend 🚀

Este é o repositório de backend para a plataforma **NextGen E-Commerce**, desenvolvido como projeto final do Bootcamp da Accenture. O projeto consiste em uma API RESTful robusta desenvolvida em **Node.js** com **Express**, estruturada para ser executada como **Firebase Cloud Functions** e integrada com a API do **Google Gemini** para recursos de Inteligência Artificial.

Para fins de portabilidade e facilidade de execução local, o projeto utiliza arquivos JSON locais para persistência de dados.

---

## 🛠️ Tecnologias Utilizadas

- **Runtime**: Node.js (v22+)
- **Framework Web**: Express.js
- **Plataforma Serverless**: Firebase Cloud Functions & Firebase CLI (emuladores)
- **Segurança**: JSON Web Token (JWT) & bcryptjs (hash de senhas)
- **Validação de Dados**: Zod
- **Documentação**: Swagger UI & swagger-jsdoc
- **IA**: Google Gemini API (`@google/genai`)
- **Testes**: Vitest

---

## 📁 Estrutura de Pastas

A estrutura básica do diretório `functions` é a seguinte:

```text
functions/
├── src/
│   ├── AI/             # Integração com o Google Gemini API
│   ├── controllers/    # Controladores que gerenciam a lógica de requisição/resposta
│   ├── docs/           # Configuração da documentação Swagger
│   ├── middleware/     # Middlewares de autenticação, validação e tratamento de erros
│   ├── repositories/   # Camada de persistência de dados (leitura/escrita dos arquivos JSON)
│   │   └── data/       # Arquivos JSON que funcionam como o banco de dados local
│   ├── routes/         # Definições de rotas da API
│   ├── services/       # Regras de negócio da aplicação
│   ├── utils/          # Funções utilitárias
│   ├── app.js          # Configuração principal do Express
│   └── server.js       # Ponto de entrada do servidor local (porta 8000)
├── index.js            # Ponto de entrada das Cloud Functions do Firebase
├── package.json        # Dependências e scripts npm
└── .env                # Variáveis de ambiente locais
```

---

## 🚀 Como Executar o Projeto Localmente

### 1. Pré-requisitos
Certifique-se de ter instalado em sua máquina:
- **Node.js** (versão 22 ou superior recomendada)
- **npm** (instalado automaticamente com o Node)
- **Firebase CLI** (opcional, necessário se for rodar via emuladores do Firebase)

---

### 2. Instalação

1. Acesse a pasta de funções a partir da raiz do projeto:
   ```bash
   cd functions
   ```

2. Instale as dependências necessárias:
   ```bash
   npm install
   ```

---

### 3. Configuração das Variáveis de Ambiente

Crie um arquivo chamado `.env` dentro da pasta `functions` e defina as variáveis necessárias:

```env
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRATION=1h
GEMINI_API_KEY=sua_chave_da_api_do_gemini_aqui
```

> 💡 **Dica**: Você pode obter uma chave de API para o Google Gemini no [Google AI Studio](https://aistudio.google.com/).

---

### 4. Inicialização de Dados (Seeding)

Para facilitar os testes, criamos um script para popular o banco de dados com uma conta de administrador inicial. Para criar o usuário administrador padrão, execute:

```bash
npm run seed
```

Este comando criará o seguinte usuário no arquivo `functions/src/repositories/data/users.json`:
- **E-mail**: `admin@nextgen.com`
- **Senha**: `admin123`

---

### 5. Executando o Servidor

Você tem duas formas de rodar a aplicação localmente:

#### Opção A: Servidor Express Convencional (Recomendado para Desenvolvimento Rápido)
Esta opção inicia o servidor rapidamente na porta `8000` usando o recurso de auto-reload (`node --watch`):

```bash
npm run dev
```
O servidor estará disponível em: `http://localhost:8000`

#### Opção B: Emuladores do Firebase (Simulação Próxima à Produção)
Se você deseja simular o comportamento de Cloud Functions localmente:

```bash
npm run serve
```
Os emuladores iniciarão a Cloud Function `api` baseada no Express.

---

## 📝 Documentação da API (Swagger)

Quando o servidor Express convencional estiver rodando (Opção A), você poderá acessar a documentação interativa da API via Swagger no seguinte endereço:

👉 **[http://localhost:8000/api-docs](http://localhost:8000/api-docs)**

Lá você encontrará a listagem de todos os endpoints disponíveis, parâmetros necessários e esquemas de autenticação Bearer JWT.

---

## 🧪 Executando Testes

Para rodar a suíte de testes unitários desenvolvida com **Vitest**:

```bash
npm run test
```
