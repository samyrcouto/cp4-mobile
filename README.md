# CP5 - Controle de Estudos Mobile

## Integrante

- Samyr Oliveira

## Descrição

Aplicativo mobile desenvolvido em React Native com Expo, Firebase Authentication, Cloud Firestore e AsyncStorage.

O projeto é a evolução do CheckPoint 4 e mantém o fluxo de autenticação enquanto adiciona um sistema de Controle de Estudos com operações CRUD no Cloud Firestore.

## Funcionalidades

### Autenticação
- Cadastro
- Login
- Persistência da sessão
- Recuperação de senha
- Logout
- Exclusão da conta

### Firestore / CRUD
- Cadastro de estudos
- Consulta/listagem dos estudos
- Edição de estudos
- Exclusão de estudos com confirmação
- Atualização da interface após operações
- Registros isolados por usuário autenticado

### Registro de estudo
Cada registro possui cinco informações:

- Matéria
- Assunto
- Data
- Tempo de estudo (minutos)
- Status: Planejado, Em andamento ou Concluído

## Tecnologias

- React Native
- Expo
- TypeScript
- Expo Router
- Firebase Authentication
- Cloud Firestore
- AsyncStorage

## Estrutura do Firestore

```text
usuarios
└── {uid_do_usuario}
    └── registros
        ├── {registroId}
        │   ├── materia
        │   ├── assunto
        │   ├── data
        │   ├── tempoEstudo
        │   ├── status
        │   └── criadoEm
        └── {registroId}
```

O `uid` utilizado na estrutura vem do Firebase Authentication. As regras do Firestore permitem que cada usuário leia, crie, atualize e exclua somente os registros dentro do próprio UID.

## Estrutura do projeto

```text
src/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── login.tsx
│   ├── cadastro.tsx
│   ├── recuperar-senha.tsx
│   ├── home.tsx
│   ├── registros.tsx
│   ├── cadastro-registro.tsx
│   ├── editar-registro.tsx
│   └── perfil.tsx
│
└── services/
    ├── firebase.ts
    └── firestore.ts

firestore.rules
README.md
```

## Configuração do Firebase

O projeto utiliza a configuração do Firebase definida em `src/services/firebase.ts`.

No Firebase Console, é necessário:

1. Manter o Firebase Authentication habilitado com e-mail e senha.
2. Criar/habilitar o Cloud Firestore.
3. Publicar as regras presentes em `firestore.rules`.

## Instalação

```bash
npm install
```

## Execução

```bash
npx expo start
```

Depois, executar no dispositivo/emulador conforme o ambiente configurado.

## Demonstração do CP5

O fluxo recomendado para o vídeo é:

1. Criar uma conta.
2. Fazer login.
3. Cadastrar pelo menos dois estudos.
4. Mostrar os registros carregados do Firestore.
5. Editar um estudo.
6. Excluir um estudo com confirmação.
7. Demonstrar que os registros estão vinculados ao usuário autenticado.
8. Fazer logout.
9. Fechar e abrir novamente o aplicativo para demonstrar a persistência da sessão.
