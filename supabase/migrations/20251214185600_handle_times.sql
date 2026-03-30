CREATE OR REPLACE FUNCTION public.handle_times()
    RETURNS trigger
    SET search_path = 'public'
    LANGUAGE plpgsql
    SECURITY definer
AS
$$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        NEW.created_at := now();
        NEW.updated_at := now();
    ELSEIF (TG_OP = 'UPDATE') THEN
        NEW.created_at = OLD.created_at;
        NEW.updated_at = now();
    END IF;
    RETURN NEW;
END;
$$;
