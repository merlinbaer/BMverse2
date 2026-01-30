CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger
    SET search_path = 'public'
    LANGUAGE plpgsql
    SECURITY definer
AS
$$
BEGIN
    INSERT INTO public.gl_profiles (id, user_email, user_role)
    VALUES (new.id, new.email, 'user')
    ON conflict (id) do nothing;
    RETURN new;
END;
$$;

ALTER FUNCTION public.handle_new_user() owner to postgres;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT
    ON auth.users
    FOR each ROW
execute procedure public.handle_new_user();

CREATE OR REPLACE FUNCTION public.delete_user()
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public, auth
AS
$$
BEGIN
    DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;

CREATE OR REPLACE FUNCTION public.update_last_seen()
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
AS
$$
BEGIN
    UPDATE public.gl_profiles
    SET last_seen_at = now()
    WHERE id = auth.uid();
END;
$$;

CREATE OR REPLACE FUNCTION public.is_public_user()
    RETURNS boolean
    SET search_path = 'public'
    LANGUAGE sql stable
AS
$$
SELECT EXISTS (SELECT 1
               FROM public.gl_profiles p
               WHERE p.id = auth.uid()
                 AND p.user_role in ('user', 'moderator', 'admin'));
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
    RETURNS boolean
    SET search_path = 'public'
    LANGUAGE sql stable
AS
$$
SELECT EXISTS (SELECT 1
               FROM public.gl_profiles p
               WHERE p.id = auth.uid()
                 AND p.user_role = 'admin');
$$;

CREATE OR REPLACE FUNCTION public.is_moderator()
    RETURNS boolean
    SET search_path = 'public'
    LANGUAGE sql stable
AS
$$
SELECT EXISTS (SELECT 1
               FROM public.gl_profiles p
               WHERE p.id = auth.uid()
                 AND p.user_role = 'moderator');
$$;

