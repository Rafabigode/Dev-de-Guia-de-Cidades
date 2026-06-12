# 🌍 GNUOcto — Guia de Cidades

Aplicativo React Native (Expo) para explorar cidades ao redor do mundo.

---

## 📱 Funcionalidades

- **Explorar** — Busca e filtro de cidades por nome ou país via GeoNames API
- **Detalhes** — Informações gerais (população, fuso, coordenadas), pontos de interesse via Wikipedia
- **Minhas Viagens** — Lista de cidades favoritas (persistência local)
- **Minhas Dicas** — CRUD completo de dicas de viagem com fotos (POST / PUT / DELETE)
- **Autenticação** — Login e cadastro locais (AsyncStorage)
- **Fotos** — Seleção de fotos da galeria e anexação às dicas

---

## 🚀 Como rodar

### Pré-requisitos

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- App **Expo Go** no celular (iOS ou Android)

### Instalação

```bash
git clone https://github.com/SEU_USUARIO/gnuocto.git
cd gnuocto
npm install
npx expo start
```

Escaneie o QR Code com o Expo Go.

---

## 🔑 API GeoNames

O app usa a [GeoNames API](https://www.geonames.org/) gratuita.

1. Crie uma conta em https://www.geonames.org/login
2. Ative o acesso a APIs gratuitas na sua conta
3. Substitua `'demo'` pelo seu username em `src/services/geonamesApi.js`:

```js
const GEONAMES_USER = 'SEU_USERNAME_AQUI';
```

> O usuário `demo` tem limite muito baixo. Com sua própria conta gratuita você tem 30.000 créditos/hora.

---

## 📁 Estrutura do Projeto

```
GNUOcto/
├── App.js                          # Entry point
├── app.json                        # Expo config
├── package.json
├── src/
│   ├── theme.js                    # Cores, espaçamento, tipografia
│   ├── context/
│   │   ├── AuthContext.js          # Autenticação
│   │   ├── FavoritesContext.js     # Cidades favoritas
│   │   └── TipsContext.js          # CRUD de dicas (POST/PUT/DELETE)
│   ├── navigation/
│   │   └── AppNavigator.js         # Rotas e tabs
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── ExploreScreen.js        # Busca e filtro
│   │   ├── CityDetailScreen.js     # Detalhes + POI + Dicas
│   │   ├── MyTripsScreen.js        # Favoritos
│   │   ├── MyTipsScreen.js         # Lista de dicas do usuário
│   │   ├── AddEditTipScreen.js     # Criar/Editar dica + fotos
│   │   └── ProfileScreen.js        # Perfil e configurações
│   └── services/
│       └── geonamesApi.js          # Integração GeoNames API
```

---

## 🏗️ Tecnologias

| Tecnologia | Uso |
|---|---|
| React Native (Expo) | Framework principal |
| React Navigation | Navegação (Stack + Bottom Tabs) |
| AsyncStorage | Persistência local |
| expo-image-picker | Seleção de fotos |
| GeoNames API | Dados geográficos das cidades |

---

## 📤 Publicar no GitHub

```bash
git init
git add .
git commit -m "feat: GNUOcto - Guia de Cidades completo"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/gnuocto.git
git push -u origin main
```

---

## 📸 Telas

| Tela | Descrição |
|---|---|
| Login / Cadastro | Autenticação local |
| Explorar | Busca de cidades com filtro por país |
| Detalhes da Cidade | Info, pontos de interesse, dicas |
| Minhas Viagens | Cidades salvas como favoritas |
| Minhas Dicas | Gerenciar dicas (POST/PUT/DELETE) |
| Adicionar/Editar Dica | Formulário com categorias e fotos |
| Perfil | Estatísticas e configurações |

---

## 📝 Observações

- A autenticação é local (AsyncStorage), não há backend real
- Para produção, substitua por JWT + API real
- Os dados de favoritos e dicas ficam no dispositivo
- As fotos são referenciadas por URI local
