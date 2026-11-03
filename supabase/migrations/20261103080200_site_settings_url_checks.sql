-- Contact links render as hrefs, so hold them to the same https:// rule as project
-- links (a stray "javascript:" value would otherwise become a clickable link).
alter table public.site_settings
  add constraint site_settings_linkedin_https check (linkedin_url ~ '^https://'),
  add constraint site_settings_github_https check (github_url ~ '^https://'),
  add constraint site_settings_email_format check (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$');
