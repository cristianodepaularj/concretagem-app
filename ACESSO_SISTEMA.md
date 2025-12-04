# Como Acessar o Sistema

## Problema: Email já cadastrado via Magic Link

Se você tentou cadastrar e recebeu erro "email já registrado", é porque esse email foi criado quando você usou o magic link (link por email).

### Solução: Redefinir Senha no Supabase

1. **Vá no Supabase Dashboard** → Authentication → Users
2. **Encontre o usuário** (cristianospaula1972@gmail.com)
3. **Clique nos 3 pontinhos** → "Send Password Recovery Email"
4. **Abra o email** e clique no link
5. **Defina uma nova senha**
6. **Volte ao app** e faça login com email + senha

## Alternativa: Criar Novo Usuário de Teste

Se quiser testar o cadastro:
1. Use um email diferente (ex: teste@gmail.com)
2. Clique em "Cadastrar"
3. Preencha email e senha
4. Faça login

## Erro 404 (DEPLOYMENT_NOT_FOUND)

Se aparecer erro 404 ao acessar o site:
- Aguarde 2-3 minutos após o push
- A Vercel está fazendo o deploy
- Recarregue a página

## Comandos para Enviar Correções

```bash
git add .
git commit -m "Fix signup error handling"
git push
```
