# Configurar Notificações por Email

## Opção 1: Usando Resend (Recomendado - Grátis até 3000 emails/mês)

### 1. Criar conta no Resend
- Acesse https://resend.com
- Crie uma conta gratuita
- Verifique seu domínio ou use o domínio de teste

### 2. Obter API Key
- No dashboard do Resend, vá em "API Keys"
- Crie uma nova API key
- Copie a chave

### 3. Configurar no Supabase
```bash
# No terminal do Supabase SQL Editor, execute:
```

```sql
-- Criar tabela de configuração
CREATE TABLE IF NOT EXISTS public.email_config (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_email text NOT NULL,
    resend_api_key text,
    created_at timestamp with time zone DEFAULT now()
);

-- Inserir configuração
INSERT INTO public.email_config (admin_email, resend_api_key)
VALUES ('cristianospaula1972@gmail.com', 'SUA_RESEND_API_KEY_AQUI');
```

### 4. Criar Edge Function no Supabase

No Supabase Dashboard:
1. Vá em "Edge Functions"
2. Crie uma nova função chamada `send-order-notification`
3. Cole o código:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { order, consultant } = await req.json()
  
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
  const ADMIN_EMAIL = 'cristianospaula1972@gmail.com'
  
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: 'Concretagem App <onboarding@resend.dev>',
      to: [ADMIN_EMAIL],
      subject: `Novo Pedido - ${order.client}`,
      html: `
        <h2>Novo Pedido Recebido</h2>
        <p><strong>Consultor:</strong> ${consultant}</p>
        <p><strong>Cliente:</strong> ${order.client}</p>
        <p><strong>Filial:</strong> ${order.branch}</p>
        <p><strong>Volume:</strong> ${order.volume} m³</p>
        <p><strong>Data:</strong> ${order.concreteDate}</p>
        <p><strong>Tipo:</strong> ${order.pumpType}</p>
        ${order.notes ? `<p><strong>Observações:</strong> ${order.notes}</p>` : ''}
      `
    })
  })
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

### 5. Configurar variável de ambiente
- No Supabase, vá em "Edge Functions" → "Settings"
- Adicione: `RESEND_API_KEY` = sua chave do Resend

### 6. Atualizar o código do app

No arquivo `src/context/DataContext.tsx`, após adicionar o pedido:

```typescript
const addOrder = async (orderData: Omit<Order, 'id' | 'status'>) => {
    const newOrder = {
        id: crypto.randomUUID(),
        ...orderData,
        status: 'Pending'
    };

    const { error } = await supabase.from('orders').insert([newOrder]);
    
    if (!error) {
        // Enviar notificação por email
        try {
            await supabase.functions.invoke('send-order-notification', {
                body: {
                    order: newOrder,
                    consultant: user?.name
                }
            });
        } catch (emailError) {
            console.error('Erro ao enviar email:', emailError);
            // Não bloqueia o fluxo se o email falhar
        }
        
        setOrders([...orders, newOrder]);
    }
};
```

## Opção 2: Usando Trigger do Supabase (Mais Simples)

Execute o arquivo `setup_email_notifications.sql` no Supabase SQL Editor.

Isso cria um trigger que registra no log quando um pedido é criado. Para enviar emails reais, você precisará integrar com um serviço como:
- Resend (recomendado)
- SendGrid
- Mailgun
- AWS SES

## Testando

1. Crie um novo pedido no app
2. Verifique o email do admin
3. Você deve receber uma notificação com os detalhes do pedido

## Troubleshooting

- **Email não chega**: Verifique spam/lixo eletrônico
- **Erro 401**: API key inválida
- **Erro 403**: Domínio não verificado (use domínio de teste do Resend)
