# Database Migrations

This directory contains SQL migration scripts for the MasterFabric Remote database schema.

## How to Apply Migrations

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of the migration file you want to apply
4. Paste and execute the SQL script
5. Verify the changes were applied successfully

## Migration Files

### `001_update_public_api_policy.sql`
**Date**: 2024  
**Description**: Updates the public API RLS policy to only allow reading configs that have been published (`last_published_at IS NOT NULL`). This ensures that:
- Unpublished configs cannot be accessed via the public API
- Empty arrays are not returned for configs that haven't been published
- Only live, published configurations are accessible to anonymous users

**When to apply**: After initial setup, if you're experiencing empty array responses from the public API for published configs.

## Migration Order

Apply migrations in numerical order (001, 002, etc.) if multiple migrations exist.

## Rollback

If you need to rollback a migration, check the migration file comments for rollback instructions, or manually reverse the changes.

