# Como subir seu projeto para o GitHub

Para colocar seu código no GitHub, siga estes passos. Você precisará ter o **Git** instalado no seu computador e uma conta no [GitHub](https://github.com).

## Passo 1: Criar Repositório no GitHub
1.  Acesse [github.com/new](https://github.com/new).
2.  **Repository name**: Digite um nome, ex: `concretagem-app`.
3.  **Public/Private**: Escolha "Private" se quiser manter o código fechado, ou "Public" se não se importar.
4.  **Initialize this repository with**: Deixe todas as opções desmarcadas (sem README, sem .gitignore, etc).
5.  Clique em **Create repository**.

## Passo 2: Enviar o código pelo VS Code (Terminal)
Abra o terminal do VS Code (Ctrl + J ou Terminal -> New Terminal) e digite os comandos abaixo, um por um:

1.  **Inicializar o Git** (se ainda não fez):
    ```bash
    git init
    ```

2.  **Adicionar todos os arquivos**:
    ```bash
    git add .
    ```

3.  **Salvar as alterações (Commit)**:
    ```bash
    git commit -m "Primeira versão do sistema"
    ```

4.  **Renomear a branch principal para 'main'**:
    ```bash
    git branch -M main
    ```

5.  **Conectar com o GitHub** (Substitua `SEU_USUARIO` pelo seu nome de usuário do GitHub):
    ```bash
    git remote add origin https://github.com/SEU_USUARIO/concretagem-app.git
    ```
    *Dica: Na página do repositório que você criou, o GitHub mostra esse comando exato para você copiar.*

6.  **Enviar os arquivos (Push)**:
    ```bash
    git push -u origin main
    ```

## Problemas Comuns
- **Erro de autenticação**: Se pedir senha, o GitHub não aceita mais a senha da conta. Você precisará criar um "Personal Access Token" ou usar o "Git Credential Manager" (que geralmente abre uma janelinha para você logar no navegador).
- **"Remote origin already exists"**: Se der esse erro no passo 5, rode `git remote remove origin` e tente novamente.

Após fazer isso, seu código estará no GitHub e pronto para ser importado pela Vercel!
