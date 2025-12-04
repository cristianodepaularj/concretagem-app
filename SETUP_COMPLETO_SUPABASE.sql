-- ============================================
-- SETUP COMPLETO DO BANCO DE DADOS SUPABASE
-- Sistema de Concretagem
-- ============================================

-- IMPORTANTE: Execute este script no SQL Editor do Supabase
-- na ordem apresentada

-- ============================================
-- 1. CRIAR TABELAS
-- ============================================

-- Tabela de usuários (perfis)
CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text UNIQUE NOT NULL,
    role text NOT NULL CHECK (role IN ('admin', 'consultant')),
    created_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS na tabela users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS public.orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "dateRequest" date NOT NULL,
    branch text NOT NULL,
    "consultantId" uuid NOT NULL REFERENCES public.users(id),
    "consultantName" text NOT NULL,
    client text NOT NULL,
    "clientPhone" text,
    volume numeric NOT NULL,
    "pumpType" text NOT NULL,
    "concreteDate" date NOT NULL,
    "concreteTime" text,
    fck numeric,
    contract numeric,
    notes text,
    observations text,
    status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Scheduled')),
    created_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS na tabela orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Tabela de configuração de email
CREATE TABLE IF NOT EXISTS public.email_config (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_email text NOT NULL,
    resend_api_key text,
    created_at timestamp with time zone DEFAULT now()
);

-- ============================================
-- 2. POLÍTICAS RLS (Row Level Security)
-- ============================================

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.users;

DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.orders;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON public.orders;
DROP POLICY IF EXISTS "Enable update for admins" ON public.orders;
DROP POLICY IF EXISTS "Enable delete for admins" ON public.orders;

-- Políticas para USERS
CREATE POLICY "Users can view own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users"
    ON public.users FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Políticas para ORDERS
CREATE POLICY "Enable insert for authenticated users"
    ON public.orders FOR INSERT
    WITH CHECK (auth.uid() = "consultantId");

CREATE POLICY "Enable read for authenticated users"
    ON public.orders FOR SELECT
    USING (true);

CREATE POLICY "Enable update for admins"
    ON public.orders FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Enable delete for admins"
    ON public.orders FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- ============================================
-- 3. CRIAR PERFIS DE USUÁRIOS
-- ============================================

-- Criar perfis para todos os usuários existentes em auth.users
INSERT INTO public.users (id, name, email, role)
SELECT 
    id,
    COALESCE(raw_user_meta_data->>'name', email) as name,
    email,
    CASE 
        WHEN email = 'cristianospaula1972@gmail.com' THEN 'admin'
        ELSE 'consultant'
    END as role
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;

-- Atualizar perfis específicos (ajuste os emails conforme necessário)
UPDATE public.users
SET 
    name = 'Cristiano Santos de Paula',
    role = 'admin'
WHERE email = 'cristianospaula1972@gmail.com';

UPDATE public.users
SET 
    name = 'Rosimeire Guerra',
    role = 'consultant'
WHERE email = 'rosimeireguerra1973@gmail.com';

-- ============================================
-- 4. FUNÇÃO E TRIGGER PARA CRIAR PERFIL AUTOMATICAMENTE
-- ============================================

-- Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, name, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        NEW.email,
        CASE 
            WHEN NEW.email = 'cristianospaula1972@gmail.com' THEN 'admin'
            ELSE 'consultant'
        END
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para executar a função quando novo usuário é criado
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 5. CONFIGURAÇÃO DE EMAIL
-- ============================================

-- Inserir configuração de email do admin
INSERT INTO public.email_config (admin_email)
VALUES ('cristianospaula1972@gmail.com')
ON CONFLICT DO NOTHING;

-- Função para enviar notificação quando pedido é criado
CREATE OR REPLACE FUNCTION notify_new_order()
RETURNS TRIGGER AS $$
DECLARE
    admin_email_address text;
    consultant_name text;
    order_details text;
BEGIN
    -- Buscar email do admin
    SELECT admin_email INTO admin_email_address
    FROM public.email_config
    LIMIT 1;
    
    -- Buscar nome do consultor
    SELECT name INTO consultant_name
    FROM public.users
    WHERE id = NEW."consultantId";
    
    -- Montar detalhes do pedido
    order_details := format(
        'Novo pedido de %s\n\nCliente: %s\nFilial: %s\nVolume: %s m³\nData: %s\nTipo: %s',
        consultant_name,
        NEW.client,
        NEW.branch,
        NEW.volume,
        NEW."concreteDate",
        NEW."pumpType"
    );
    
    -- Log para debug
    RAISE NOTICE 'Enviar email para %: %', admin_email_address, order_details;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para executar a função quando um novo pedido é inserido
DROP TRIGGER IF EXISTS on_order_created ON public.orders;
CREATE TRIGGER on_order_created
    AFTER INSERT ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION notify_new_order();

-- ============================================
-- 6. VERIFICAÇÕES E CONSULTAS ÚTEIS
-- ============================================

-- Verificar usuários criados
SELECT id, name, email, role, created_at 
FROM public.users 
ORDER BY created_at DESC;

-- Verificar pedidos
SELECT 
    o.id,
    o."dateRequest",
    o.client,
    o.branch,
    o.volume,
    o.status,
    u.name as consultant_name
FROM public.orders o
LEFT JOIN public.users u ON o."consultantId" = u.id
ORDER BY o.created_at DESC;

-- Verificar políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================
-- FIM DO SCRIPT
-- ============================================

-- PRÓXIMOS PASSOS:
-- 1. Execute este script completo no Supabase SQL Editor
-- 2. Configure a Edge Function para envio de emails (veja EMAIL_SETUP_GUIDE.md)
-- 3. Teste criando um novo usuário e um novo pedido
