# 🐄 Vaquinha do Tob - Plataforma Completa de Financiamento Coletivo

Uma plataforma moderna e segura para arrecadação de fundos com integração **Pix** 100% brasileira! 🇧🇷

## 🎯 O que é?

**Vaquinha do Tob** é uma plataforma de crowdfunding que permite:
- 💰 Criar campanhas de arrecadação
- 🤝 Receber apoio via Pix
- 📊 Acompanhar progresso em tempo real
- 👥 Conectar doadores com criadores

## 🚀 Estrutura do Projeto

```
vaquinha-do-tob/                    # Frontend (HTML/CSS/JS)
├── index.html                      # Página principal
├── styles.css                      # Estilos
├── script.js                       # Lógica frontend
└── README.md

vaquinha-do-tob-backend/            # Backend (Node.js)
├── server.js                       # Servidor Express
├── package.json                    # Dependências
├── .env.example                    # Variáveis de ambiente
├── models/                         # Modelos MongoDB
│   ├── Usuario.js
│   ├── Campanha.js
│   └── Pagamento.js
├── routes/                         # Rotas da API
│   ├── auth.js                     # Autenticação
│   ├── campanhas.js                # Campanhas
│   ├── pagamentos.js               # Pagamentos Pix
│   └── usuarios.js                 # Perfil
├── middleware/                     # Middlewares
│   └── auth.js                     # Verificação JWT
└── README.md
```

## 📋 Pré-requisitos

- Node.js 14+ instalado
- npm ou yarn
- Conta MongoDB Atlas (gratuita)
- Banco digital com Pix (Nubank, Inter, C6, etc)

## ⚙️ Instalação e Setup

### 1. Backend

#### 1.1 Clonar repositório
```bash
git clone https://github.com/pradoarthurbandeira-dotcom/vaquinha-do-tob-backend.git
cd vaquinha-do-tob-backend
```

#### 1.2 Instalar dependências
```bash
npm install
```

#### 1.3 Configurar variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```env
# MongoDB - Criar conta grátis em https://www.mongodb.com/cloud/atlas
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/vaquinha

# JWT - Gere uma chave forte
JWT_SECRET=sua_chave_secreta_super_segura_aqui_32caracteres

# Servidor
PORT=5000
NODE_ENV=development

# Pix - Sua chave Pix (já configurada)
PIX_KEY=aa8609ba-23cb-46e5-910f-dbc2164d05d2
PIX_BANK=Nubank

# CORS - URLs permitidas
CORS_ORIGIN=http://localhost:3000,https://pradoarthurbandeira-dotcom.github.io
```

#### 1.4 Iniciar servidor
```bash
# Desenvolvimento (com nodemon)
npm run dev

# Produção
npm start
```

Server rodando em: `http://localhost:5000`

### 2. Frontend

O frontend está hospedado no GitHub Pages e já está pronto em:
```
https://pradoarthurbandeira-dotcom.github.io/vaquinha-do-tob/
```

Para desenvolver localmente:

```bash
# Opção 1: Usar Live Server (VS Code)
# Instale extensão "Live Server"
# Clique com botão direito em index.html > "Open with Live Server"

# Opção 2: Python SimpleHTTPServer
python -m http.server 3000

# Opção 3: Node.js http-server
npm install -g http-server
http-server -p 3000
```

Frontend rodando em: `http://localhost:3000`

## 📡 API Endpoints

### 🔐 Autenticação

#### Registrar novo usuário
```bash
POST /api/auth/registro
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@email.com",
  "cpf": "12345678901",
  "senha": "senha123",
  "senhaConfirm": "senha123"
}
```

**Resposta (201):**
```json
{
  "message": "Usuário registrado com sucesso!",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": "507f1f77bcf86cd799439011",
    "nome": "João Silva",
    "email": "joao@email.com"
  }
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "senha": "senha123"
}
```

#### Obter perfil (requer token)
```bash
GET /api/auth/me
Authorization: Bearer seu_token_jwt
```

---

### 📊 Campanhas

#### Listar todas campanhas
```bash
GET /api/campanhas
```

#### Obter detalhes da campanha
```bash
GET /api/campanhas/:id
```

#### Criar campanha (requer autenticação)
```bash
POST /api/campanhas
Authorization: Bearer seu_token_jwt
Content-Type: application/json

{
  "titulo": "Comprar notebook para estudar",
  "descricao": "Preciso de um notebook para programação",
  "categoria": "educacao",
  "metaMoney": 2500,
  "dataFim": "2025-12-31T23:59:59Z",
  "imagem": "https://via.placeholder.com/300x200"
}
```

#### Atualizar campanha (requer autenticação)
```bash
PUT /api/campanhas/:id
Authorization: Bearer seu_token_jwt
Content-Type: application/json

{
  "titulo": "Novo título",
  "descricao": "Nova descrição"
}
```

#### Deletar campanha (requer autenticação)
```bash
DELETE /api/campanhas/:id
Authorization: Bearer seu_token_jwt
```

---

### 💳 Pagamentos Pix

#### Criar pagamento Pix (requer autenticação)
```bash
POST /api/pagamentos/pix
Authorization: Bearer seu_token_jwt
Content-Type: application/json

{
  "campanhaId": "507f1f77bcf86cd799439011",
  "valor": 100
}
```

**Resposta:**
```json
{
  "message": "Pagamento Pix gerado com sucesso!",
  "pagamento": {
    "id": "507f1f77bcf86cd799439012",
    "valor": 100,
    "statusPix": "pendente",
    "transactionId": "uuid-aqui",
    "brCode": "00020126580014br.gov.bcb.pix...",
    "pixKey": "aa8609ba-23cb-46e5-910f-dbc2164d05d2",
    "banco": "Nubank"
  }
}
```

#### Confirmar pagamento (requer autenticação)
```bash
POST /api/pagamentos/confirmar/:id
Authorization: Bearer seu_token_jwt
```

#### Histórico de pagamentos (requer autenticação)
```bash
GET /api/pagamentos/historico
Authorization: Bearer seu_token_jwt
```

---

### 👤 Usuários

#### Listar usuários
```bash
GET /api/usuarios
```

#### Obter perfil do usuário
```bash
GET /api/usuarios/perfil/:id
```

#### Atualizar perfil (requer autenticação)
```bash
PUT /api/usuarios/atualizar
Authorization: Bearer seu_token_jwt
Content-Type: application/json

{
  "nome": "João Silva",
  "telefone": "11999999999",
  "bio": "Desenvolvedor apaixonado por tecnologia",
  "avatar": "https://via.placeholder.com/100",
  "chavePixCPF": "123.456.789-00"
}
```

---

## 🔑 Autenticação

Todas as rotas protegidas requerem o header:
```
Authorization: Bearer SEU_TOKEN_JWT_AQUI
```

O token é obtido no login/registro e dura **7 dias**.

---

## 💾 Banco de Dados

### MongoDB Atlas (Gratuito)

1. Acesse: https://www.mongodb.com/cloud/atlas
2. Crie uma conta gratuita
3. Crie um cluster
4. Copie a connection string
5. Cole em `MONGODB_URI` no `.env`

### Modelos de Dados

#### Usuario
```javascript
{
  _id: ObjectId,
  nome: String,
  email: String (único),
  senha: String (hash),
  cpf: String (único),
  chavePixCPF: String,
  telefone: String,
  avatar: String,
  bio: String,
  campanhasCriadas: [ObjectId],
  contribuicoes: [ObjectId],
  dataCriacao: Date,
  ativo: Boolean
}
```

#### Campanha
```javascript
{
  _id: ObjectId,
  titulo: String,
  descricao: String,
  categoria: String,
  criador: ObjectId (ref Usuario),
  metaMoney: Number,
  valorArrecadado: Number,
  dataInicio: Date,
  dataFim: Date,
  imagem: String,
  video: String,
  status: String (ativa/finalizada/cancelada),
  pagamentos: [ObjectId],
  seguidores: [ObjectId],
  atualizacoes: Array,
  dataCriacao: Date
}
```

#### Pagamento
```javascript
{
  _id: ObjectId,
  campanha: ObjectId (ref Campanha),
  usuario: ObjectId (ref Usuario),
  valor: Number,
  metodo: String (pix/cartao/boleto),
  statusPix: String (pendente/confirmado/falhou),
  qrCode: String,
  transactionId: String,
  pixBrCode: String,
  dataTransacao: Date,
  dataConfirmacao: Date,
  comprovante: String,
  mensagem: String
}
```

---

## 🚀 Deploy

### Backend (Heroku/Railway/Render)

#### Option 1: Heroku
```bash
# Instale Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Criar app
heroku create vaquinha-do-tob-backend

# Configurar variáveis
heroku config:set MONGODB_URI=sua_url
heroku config:set JWT_SECRET=sua_chave

# Deploy
git push heroku main
```

#### Option 2: Railway
```bash
# Instale Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Frontend (já está no GitHub Pages)

O frontend está em: `https://pradoarthurbandeira-dotcom.github.io/vaquinha-do-tob/`

Para fazer atualizações, basta fazer push para `main` branch.

---

## 🔄 Fluxo de Funcionamento

### 1. Usuário se Registra
```
Usuário preenche form → Dados salvos MongoDB → Token JWT gerado → Login automático
```

### 2. Criar Campanha
```
Usuário autenticado → Preenche dados → Campanha criada → Recebe link para compartilhar
```

### 3. Receber Apoio via Pix
```
Doador clica "Apoiar" → Informa valor → QR Code gerado → Faz Pix → Comprovante registrado
```

### 4. Acompanhamento
```
Criador vê progresso em tempo real → Recebe notificações → Atualiza campanha
```

---

## 🛠️ Tecnologias

### Frontend
- HTML5
- CSS3 (Responsive)
- Vanilla JavaScript
- LocalStorage para tokens

### Backend
- Node.js
- Express.js
- MongoDB
- JWT (autenticação)
- Bcryptjs (senhas)
- CORS

### APIs & Serviços
- GitHub Pages (hosting frontend)
- MongoDB Atlas (banco dados)
- Pix (pagamentos)

---

## 📝 Variáveis de Ambiente

**Backend (.env)**
```env
# Banco de Dados
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/vaquinha

# Segurança
JWT_SECRET=sua_chave_super_secreta_com_32_caracteres

# Servidor
PORT=5000
NODE_ENV=development

# Pix
PIX_KEY=aa8609ba-23cb-46e5-910f-dbc2164d05d2
PIX_BANK=Nubank

# CORS
CORS_ORIGIN=http://localhost:3000,https://pradoarthurbandeira-dotcom.github.io
```

---

## 🐛 Troubleshooting

### "MongoDB connection failed"
- Verifique MONGODB_URI no .env
- Confirme IP whitelist no MongoDB Atlas
- Teste conexão: `mongosh "seu_connection_string"`

### "CORS error"
- Adicione seu domínio em CORS_ORIGIN
- Frontend e backend devem estar em portas diferentes

### "Token inválido"
- Token pode ter expirado (7 dias)
- Faça login novamente

### "Pix não funciona"
- Verifique PIX_KEY está correto
- QR Code precisa de biblioteca QRCode.js

---

## 📚 Recursos Úteis

- [Node.js Docs](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT.io](https://jwt.io/)
- [Pix - Banco Central](https://www.bcb.gov.br/pix)

---

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b feature/MinhaFeature`
3. Commit: `git commit -m 'Adiciona MinhaFeature'`
4. Push: `git push origin feature/MinhaFeature`
5. Abra um Pull Request

---

## 📄 Licença

MIT License - Veja LICENSE.md

---

## 👨‍💻 Autor

**Prado Arthur Bandeira**
- GitHub: [@pradoarthurbandeira-dotcom](https://github.com/pradoarthurbandeira-dotcom)
- Email: pradoarthurbandeira@gmail.com

Criado com ❤️ para ajudar pessoas a realizarem seus sonhos!

---

## 🎉 Próximos Passos

- [ ] Integrar QR Code generator
- [ ] Dashboard com gráficos
- [ ] Email notifications
- [ ] Social login (Google/GitHub)
- [ ] Mobile app (React Native)
- [ ] Sistema de recompensas
- [ ] Integração com mais gateways de pagamento
- [ ] Testes unitários e E2E

---

**Vaquinha do Tob - Realize seus Sonhos! 🐄✨**
