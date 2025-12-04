-- Execute este SQL no Supabase para corrigir as políticas RLS

-- 1. REMOVER políticas antigas que podem estar causando problemas
DROP POLICY IF EXISTS "Consultants can insert own orders" ON public.orders;
DROP POLICY IF EXISTS "Consultants can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can do everything" ON public.orders;

-- 2. CRIAR novas políticas mais permissivas

-- Permitir que consultores insiram pedidos (sem verificar consultantId ainda)
CREATE POLICY "Enable insert for authenticated users" ON public.orders
    FOR INSERT 
    TO authenticated
    WITH CHECK (true);

-- Permitir que todos vejam todos os pedidos (simplificado)
CREATE POLICY "Enable read for authenticated users" ON public.orders
    FOR SELECT 
    TO authenticated
    USING (true);

-- Permitir que admins atualizem qualquer pedido
CREATE POLICY "Enable update for admins" ON public.orders
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE public.users.id = auth.uid() AND public.users.role = 'admin'
        )
    );

-- Permitir que admins deletem qualquer pedido
CREATE POLICY "Enable delete for admins" ON public.orders
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE public.users.id = auth.uid() AND public.users.role = 'admin'
        )
    );

-- 3. Verificar se RLS está ativado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'orders';

-- 4. Listar políticas ativas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'orders';
