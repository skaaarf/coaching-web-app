# Add Supabase integration with Google OAuth authentication

## Summary
Implement server-side data storage using Supabase with Google OAuth authentication. This enables users to save their progress across devices and browsers.

## Features
- ✅ Supabase database schema with Row Level Security (RLS) policies
- ✅ Storage layer abstraction (localStorage for guests, Supabase for authenticated users)
- ✅ Automatic data migration from localStorage to Supabase on login
- ✅ Google OAuth authentication integration via NextAuth
- ✅ useStorage hook for unified storage access across components
- ✅ Comprehensive setup guide with environment variable configuration

## Technical Implementation

### Database Schema
Created three main tables in Supabase:
- `module_progress` - Chat module progress and conversation history
- `interactive_module_progress` - Interactive module results (Value Battle, Life Simulator, etc.)
- `user_insights` - AI-generated user insights

All tables have RLS policies ensuring users can only access their own data.

### Architecture
```
┌─────────────────┐
│  Component      │
└────────┬────────┘
         │ useStorage()
         ▼
┌─────────────────┐
│ Unified Storage │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────┐  ┌─────────┐
│Local│  │Supabase │
│Store│  │ Storage │
└─────┘  └─────────┘
```

### Files Added
- `supabase/schema.sql` - Database schema with RLS policies
- `lib/supabase.ts` - Supabase client configuration
- `lib/storage-supabase.ts` - Supabase storage layer implementation
- `lib/storage-unified.ts` - Unified storage abstraction
- `lib/migration.ts` - Data migration utilities
- `hooks/useStorage.ts` - Custom storage hook with memoization
- `components/DataMigration.tsx` - Automatic migration notification
- `SETUP_GUIDE.md` - Comprehensive setup documentation

### Files Modified
- `components/SessionProvider.tsx` - Added auth context provider
- `app/layout.tsx` - Added DataMigration component
- `app/page.tsx` - Updated to use useStorage hook
- `app/module/[moduleId]/page.tsx` - Updated to use useStorage hook
- `app/interactive/[moduleId]/page.tsx` - Updated to use useStorage hook

## User Experience

### Before Login
- Data stored in browser localStorage
- Works completely offline
- No account required

### After Login
- Automatic migration of localStorage data to Supabase
- Real-time sync across all devices
- Data persists even if browser cache is cleared
- User sees "データをクラウドに保存しました" notification

## Setup Requirements

The following environment variables must be set:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# NextAuth
AUTH_SECRET=...
AUTH_URL=http://localhost:3000

# Supabase
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

See `SETUP_GUIDE.md` for detailed setup instructions.

## Bug Fixes
- Fixed infinite re-rendering loop by memoizing useStorage hook
- Added graceful fallback for missing Supabase credentials
- Improved useEffect dependency arrays

## Testing Checklist
- [ ] Environment variables configured in Vercel
- [ ] Supabase database schema deployed
- [ ] Google OAuth redirect URIs configured
- [ ] Test guest user flow (no login)
- [ ] Test login flow with data migration
- [ ] Test multi-device sync
- [ ] Test logout and re-login

## Migration Notes
- Existing users will automatically have their localStorage data migrated on first login
- Migration happens only once per browser
- No data loss - localStorage remains as backup until user manually clears it

## Security
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Users can only access their own data
- ✅ Service role key never exposed to client
- ✅ All sensitive credentials in environment variables

## Related Documentation
- [Supabase Setup Guide](./SETUP_GUIDE.md)
- [Environment Variables](./.env.example)

## Demo
After deployment, users can:
1. Use the app without login (localStorage)
2. Click "Googleでログイン" on `/login`
3. Authenticate with Google
4. See automatic data migration notification
5. Access their data from any device

## Commits
- `fdb3919` Add Supabase integration with Google OAuth authentication
- `604b06b` Fix infinite loop and improve error handling
