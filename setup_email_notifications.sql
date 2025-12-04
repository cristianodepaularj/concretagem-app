-- Criar tabela para configurações de email
CREATE TABLE IF NOT EXISTS public.email_config (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_email text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Inserir email do admin
INSERT INTO public.email_config (admin_email)
VALUES ('cristianospaula1972@gmail.com')
ON CONFLICT DO NOTHING;

-- Criar função para enviar notificação quando pedido é criado
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
    
    -- Aqui você pode integrar com um serviço de email
    -- Por enquanto, vamos apenas registrar no log
    RAISE NOTICE 'Enviar email para %: %', admin_email_address, order_details;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para executar a função quando um novo pedido é inserido
DROP TRIGGER IF EXISTS on_order_created ON public.orders;
CREATE TRIGGER on_order_created
    AFTER INSERT ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION notify_new_order();
