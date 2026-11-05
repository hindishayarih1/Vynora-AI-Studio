# Vynora AI Studio — Foundation 0.1

This is the first runnable frontend foundation, not a finished AI-generation platform.

## Included
- Supabase email/password sign-up and sign-in
- Session persistence
- Read-only wallet balance display from `public.credit_wallets`
- Dashboard shell for AI Image, AI Video and Video Editor
- Mobile-responsive layout

## Not included yet
- Actual image/video generation provider integration
- Video editing/rendering pipeline
- Real 4K rendering/export
- APK packaging or public deployment

The 1080p / 2K / 4K labels are roadmap targets only. Real 4K output requires a video provider that supports it, plus server-side processing and storage.

## Configure Supabase
1. Copy `.env.example` to `.env.local`.
2. Set:
   - `VITE_SUPABASE_URL` to your project URL without `/rest/v1`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` to your `sb_publishable_...` key
3. Never put an `sb_secret_...` key in frontend code.

## Run locally
```bash
npm install
npm run dev
```

Open the local address printed by Vite.

## Supabase requirements
The project expects:
- `public.credit_wallets` with `user_id` (uuid) and `balance`
- A SELECT RLS policy allowing authenticated users to read only their own row
- A signup trigger that creates a wallet row for new users

For email confirmation-enabled projects, a user may need to confirm their email before signing in.

## Next implementation stages
1. Verify auth and wallet against the live Supabase project.
2. Add server-side credit ledger and secure credit deduction.
3. Integrate image and video generation providers through server-side endpoints.
4. Add storage, job status/history, editor, rendering and export.
5. Deploy web app; then package Android app after the deployed web app is stable.
