CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger
    SET search_path = 'public'
    LANGUAGE plpgsql
    SECURITY definer
    AS $$
    BEGIN
        INSERT INTO public.gl_profiles (id, user_email, user_role)
        VALUES (new.id, new.email, 'user')
        ON conflict (id) do nothing;
        RETURN new;
    END;
    $$;

ALTER FUNCTION public.handle_new_user() owner to postgres;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR each ROW execute procedure public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_times()
    RETURNS trigger
    SET search_path = 'public'
    LANGUAGE plpgsql
    SECURITY definer
    AS $$
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

CREATE OR REPLACE FUNCTION public.is_public_user()
    RETURNS boolean
    SET search_path = 'public'
    LANGUAGE sql stable
    AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.gl_profiles p
        WHERE p.id = auth.uid()
        AND p.user_role in ('user', 'moderator', 'admin')
    );
    $$;

CREATE OR REPLACE FUNCTION public.is_admin()
    RETURNS boolean
    SET search_path = 'public'
    LANGUAGE sql stable
    AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.gl_profiles p
        WHERE p.id = auth.uid()
        AND p.user_role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_moderator()
    RETURNS boolean
    SET search_path = 'public'
    LANGUAGE sql stable
    AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.gl_profiles p
        WHERE p.id = auth.uid()
        AND p.user_role = 'moderator'
  );
$$;
