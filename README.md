# Cygna Consult (cygna.com.ng)
1. Run `supabase/schema.sql` in Supabase SQL Editor.
2. Copy `.env.example` to `.env.local`, set NEXT_PUBLIC_WHATSAPP.
3. `npm install && npm run dev`
4. Make admin: sign up at /auth, then run: `update profiles set role='admin' where id=(select id from auth.users where email='YOUR_EMAIL');`
