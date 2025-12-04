-- Execute este SQL no Supabase para adicionar os novos campos na tabela orders

-- Adicionar novos campos à tabela orders
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS "clientPhone" text,
ADD COLUMN IF NOT EXISTS "concreteTime" text,
ADD COLUMN IF NOT EXISTS fck numeric,
ADD COLUMN IF NOT EXISTS contract numeric,
ADD COLUMN IF NOT EXISTS observations text;

-- Verificar a estrutura atualizada
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;
