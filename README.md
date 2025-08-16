# Frontend - Aplicação Vue.js para Contacts

Aplicação frontend desenvolvida com Vue.js 3 e PrimeVue 4.2, containerizada com Docker.

## 🚀 Tecnologias Utilizadas

- **Vue.js**: 3.x
- **PrimeVue**: 4.2
- **Node.js**: 20 (Alpine)
- **Docker**: Para containerização
- **Vite**: Como bundler e servidor de desenvolvimento

## 📋 Pré-requisitos

### Opção 1: Docker (Recomendado)
- Docker Compose

### Opção 2: Instalação Local
- Node.js 20.x ou superior
- NPM

## 🐳 Instalação com Docker (Recomendado)

### 1. Clonar o repositório
```bash
git clone url repo
cd frontend
```

### 2. Levantar contentor
```bash
docker-compose up -d
```

### 3. Entrar no contentor e instalar dependências
```bash
# Entrar no contentor
docker-compose exec node sh

# Instalar dependências
npm install

# Executar servidor de desenvolvimento
npm run dev
```

### 4. Aceder à aplicação
- **Frontend**: http://localhost:5000

## 🛠️ Instalação Local (Sem Docker)

### 1. Instalar dependências
```bash
npm install
```

### 2. Executar servidor de desenvolvimento
```bash
npm run dev
```

### 3. Aceder à aplicação
- **Frontend**: http://localhost:5173 (porta por defeito do Vite)

## 📝 Comandos Úteis

### Comandos Docker
```bash
# Levantar contentor
docker-compose up -d

# Ver registos
docker-compose logs -f

# Parar contentor
docker-compose down

# Entrar no contentor
docker-compose exec node sh

# Reiniciar contentor
docker-compose restart
```

### Scripts NPM (dentro do contentor ou localmente)
```bash
# Servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

```

## 🔧 Configuração de Desenvolvimento

### Configuração da API
```javascript
// Em desenvolvimento
const VITE_API_URL = 'http://localhost:3000'

```

## 🎨 Componentes e Bibliotecas

### PrimeVue 4.2
- **Tema**: Configurado com tema personalizável
- **Ícones**: PrimeIcons incluídos
- **Componentes**: Todos os componentes do PrimeVue disponíveis


## 🌐 Configuração da API

### Variáveis de Ambiente
Criar ficheiro `.env` na raiz:
```env
VITE_API_URL=http://localhost:3000/
```

## 📱 Funcionalidades Implementadas

- [x] Dashboard responsivo
- [x] Operações CRUD
- [x] Validação de formulários
- [x] Routing com Vue Router
- [x] Interface moderna com PrimeVue
- [x] Design responsivo

## 🚀 Build para Produção

### Com Docker
```bash
# Entrar no contentor
docker-compose exec node sh

# Criar build
npm run build

# Os ficheiros estarão em dist/
```

### Sem Docker
```bash
npm run build
```

## 🔍 Resolução de Problemas

### Problemas de permissões (Docker)
```bash
# Alterar ownership do node_modules
docker-compose exec node chown -R node:node /app/node_modules
```

### Limpar cache
```bash
# Limpar node_modules
rm -rf node_modules package-lock.json
npm install

# Com Docker
docker-compose exec node sh -c "rm -rf node_modules package-lock.json && npm install"
```

---

**Nota**: Este frontend foi desenvolvido como parte de um teste técnico, implementando uma interface moderna e responsiva com Vue.js 3 e PrimeVue 4.2.