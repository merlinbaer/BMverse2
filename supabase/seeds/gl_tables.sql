INSERT INTO "public"."gl_versions" ("version", "version_target", "version_info")
VALUES ('2.0.0', 'ios', 'initial version 2'),
       ('2.0.0', 'android', 'initial version 2'),
       ('2.0.0', 'web', 'initial version 2');

INSERT INTO "public"."gl_sync" ("updater")
VALUES ('postgres')
ON CONFLICT (sync_id) DO NOTHING;

