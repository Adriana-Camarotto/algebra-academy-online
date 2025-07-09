# Edge Function Deployment Instructions

## Create User Profile Edge Function

This Edge Function was created to handle user profile creation and bypass RLS (Row Level Security) policies that may prevent direct database inserts during user registration.

### Function Location

`supabase/functions/create-user-profile/index.ts`

### Purpose

- Handles user profile creation during signup
- Uses service role privileges to bypass RLS policies
- Called from the frontend after successful Supabase Auth signup

### Deployment Steps

1. **Install Supabase CLI** (if not already installed):

   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:

   ```bash
   supabase login
   ```

3. **Link to your project**:

   ```bash
   supabase link --project-ref rnhibdbxfbminqseayos
   ```

4. **Deploy the function**:
   ```bash
   supabase functions deploy create-user-profile
   ```

### Environment Variables Required

The function requires these environment variables to be set in your Supabase project:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your service role key (with RLS bypass privileges)

These are automatically available in Supabase Edge Functions.

### Usage

The function is called from `src/lib/auth.ts` in the `signUpWithSupabase` method after successful authentication.

### Error Handling

If the Edge Function fails, the code falls back to creating a user object with auth data only, allowing the user to continue using the app even if profile creation fails.

## Alternative Approach (if Edge Function deployment fails)

If you cannot deploy the Edge Function, you can:

1. **Check RLS Policies**: Ensure your `users` table has appropriate RLS policies that allow authenticated users to insert their own profiles.

2. **Use Database Triggers**: Create a database trigger that automatically creates a user profile when a new auth user is created.

3. **Manual Profile Creation**: Allow users to complete their profile after signup through a dedicated profile setup page.

## Troubleshooting

### Common Issues:

- **RLS Policy Errors**: The function bypasses RLS, but if you get policy errors, check your Supabase RLS settings.
- **Authentication Errors**: Ensure the JWT token is properly passed to the function.
- **CORS Errors**: The function includes CORS headers, but ensure your frontend domain is allowed in Supabase settings.

### Testing

After deployment, test the signup flow:

1. Try to create a new user account
2. Check the browser console for any errors
3. Verify the user profile is created in the Supabase dashboard
