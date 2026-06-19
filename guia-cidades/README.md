# 🌍 Guia de Cidades — Expo Router + TypeScript

App mobile de guia de cidades construído com **React Native + Expo Router + TypeScript**.

## 📱 Funcionalidades

| Aba | Descrição |
|-----|-----------|
| **Explorar** | Lista de cidades com busca por nome/país e filtro por categoria |
| **Favoritos** | Cidades salvas localmente com AsyncStorage |
| **Minhas Cidades** | CRUD completo (requer login) — criar, editar e excluir |
| **Perfil** | Login / Logout com sessão persistida |
| **Detalhes** | Tela com descrição, população, mapa interativo e favoritar |

## 🚀 Como rodar

### 1. Instalar dependências

```bash
npm install
```

### 2. Iniciar o projeto

```bash
npx expo start
```

Depois escaneie o QR code com o **Expo Go** (iOS/Android) ou pressione:
- `w` para abrir no navegador (web)
- `a` para Android (emulador)
- `i` para iOS (simulador)

## 🔑 Credenciais de acesso

```
Email: admin@guiacidades.com
Senha: 123456
```

## 🏗️ Estrutura do projeto

```
guia-cidades/
├── app/
│   ├── _layout.tsx          # Navegação por abas (Expo Router)
│   ├── index.tsx            # Aba Explorar (lista de cidades)
│   ├── favoritos.tsx        # Aba Favoritos
│   ├── minhas-cidades.tsx   # Aba CRUD (requer login)
│   ├── login.tsx            # Aba Perfil / Login
│   └── detalhes/[id].tsx    # Tela de detalhes dinâmica
├── components/
│   ├── MapaEvento.tsx       # Mapa (react-native-maps) — nativo
│   └── MapaEvento.web.tsx   # Stub para web
├── constants/
│   ├── CidadeCard.tsx       # Card de cidade reutilizável
│   └── Colors.ts            # Paleta de cores
├── dados.ts                 # Tipo Cidade (TypeScript)
├── services/
│   └── api.ts               # Cliente Axios (MockAPI)
└── hooks/                   # Hooks de tema (use-color-scheme, etc.)
```

## 🎨 Tema visual

Paleta azul-marinho escura inspirada em mapas e exploração:
- Fundo: `#050F1E` (azul-noite profundo)
- Cards: `#0D1F35`
- Acento: `#38BDF8` (azul-céu)
- Texto: `#E8F0FE`

## 🛠️ Stack tecnológica

- **React Native** 0.81 + **Expo** ~54
- **Expo Router** (file-based routing)
- **TypeScript** strict
- **Axios** + MockAPI (backend simulado)
- **AsyncStorage** (favoritos e sessão)
- **react-native-maps** (mapa nos detalhes)
- **@expo/vector-icons** (Ionicons)
