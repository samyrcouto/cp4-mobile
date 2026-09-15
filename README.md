# CP4 - Mobile Application Development

## Integrante

- Samyr Oliveira


## Descrição do projeto

Aplicativo mobile desenvolvido em React Native com Expo para implementação de um sistema de autenticação utilizando Firebase Authentication.

O sistema permite que o usuário crie uma conta, realize login, mantenha sua sessão autenticada, solicite recuperação de senha, realize logout e exclua sua conta.

A persistência da sessão é realizada utilizando AsyncStorage.

## Funcionalidades

- Cadastro de usuário
- Login com e-mail e senha
- Persistência da sessão
- Recuperação de senha
- Visualização das informações da conta
- Logout
- Exclusão da conta
- Tratamento de erros de autenticação

## Tecnologias utilizadas

- React Native
- Expo
- TypeScript
- Expo Router
- Firebase Authentication
- AsyncStorage

## Estrutura principal

```text
cp4-mobile/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── login.tsx
│   ├── cadastro.tsx
│   ├── recuperar-senha.tsx
│   └── home.tsx
│
├── services/
│   └── firebase.ts
│
└── README.md
