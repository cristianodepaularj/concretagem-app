# Como colocar seu projeto online (Deploy)

Para acessar seu sistema por um link público (ex: `seu-projeto.vercel.app`), a maneira mais fácil e gratuita é usar a **Vercel**.

## Passo 1: Preparar o Projeto (Já feito)
Seu projeto já está configurado com Vite, o que é perfeito para a Vercel.
Certifique-se de que todas as suas alterações estão salvas.

## Passo 2: Subir para o GitHub
Se você ainda não subiu seu código para o GitHub:
1.  Crie um repositório no GitHub (ex: `concretagem-app`).
2.  No terminal do VS Code, rode:
    ```bash
    git add .
    git commit -m "Versão final para deploy"
    git branch -M main
    git remote add origin https://github.com/SEU_USUARIO/concretagem-app.git
    git push -u origin main
    ```
    *(Substitua a URL pela do seu repositório)*

## Passo 3: Criar Projeto na Vercel
1.  Acesse [vercel.com](https://vercel.com) e faça login (pode usar sua conta do GitHub).
2.  Clique em **"Add New..."** -> **"Project"**.
3.  Importe o repositório `concretagem-app` que você acabou de criar.
4.  Na tela de configuração:
    *   **Framework Preset**: Vite (deve detectar automaticamente).
    *   **Environment Variables**: Aqui você **PRECISA** adicionar as variáveis do Supabase:
        *   `VITE_SUPABASE_URL`: `https://sgdyhdhoflsxfimrxwdk.supabase.co`
        *   `VITE_SUPABASE_ANON_KEY`: `sb_publishable_iF9niYRYEooVOubxr8zxyg_tUXw0HS6`
        *(Você pode pegar esses valores no arquivo `src/lib/supabase.ts`)*
5.  Clique em **Deploy**.

## Passo 4: Configurar URL no Supabase
Como seu site agora terá um link real (ex: `https://concretagem-app.vercel.app`), você precisa avisar o Supabase para aceitar logins vindos de lá.
1.  Vá no painel do Supabase -> **Authentication** -> **URL Configuration**.
2.  Em **Site URL**, coloque o link que a Vercel gerou para você.
3.  Em **Redirect URLs**, adicione também o link da Vercel (ex: `https://concretagem-app.vercel.app/**`).
4.  Salve.

Pronto! Agora você pode acessar seu sistema de qualquer lugar pelo link da Vercel.
