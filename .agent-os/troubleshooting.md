# Troubleshooting Guide

## Common Issues & Solutions

### Database Issues

#### Foreign Key Constraint Violations
**Error**: `insert or update on table "X" violates foreign key constraint`

**Solutions**:
1. Check if referenced record exists
2. Insert dependencies first (cities → clinics → veterinarians)
3. Use proper UUID format for foreign keys
4. Verify RLS policies aren't blocking access

#### Missing Columns
**Error**: `column "X" of relation "Y" does not exist`

**Solutions**:
1. Check current schema with GetOrRequestIntegration
2. Update migration scripts with correct column names
3. Verify table structure matches code expectations

#### Type Mismatches
**Error**: `column "X" is of type Y but expression is of type Z`

**Solutions**:
1. Add explicit type casting: `value::date`, `value::jsonb`
2. Use proper date formats: 'YYYY-MM-DD'
3. Convert JSON strings to objects before insertion

### Authentication Issues

#### Missing Environment Variables
**Error**: `Missing Supabase environment variables`

**Solutions**:
1. Verify all required env vars are set in Vercel
2. Check variable names match exactly (case-sensitive)
3. Restart development server after adding vars
4. Use GetOrRequestIntegration to verify connection

#### Auth Session Missing
**Error**: `Auth session missing!`

**Solutions**:
1. Check middleware configuration for public routes
2. Verify Supabase client initialization
3. Ensure cookies are properly handled
4. Test authentication flow end-to-end

### Styling Issues

#### Green Colors Persisting
**Problem**: Green colors still appear despite orange theme

**Solutions**:
1. Check for hardcoded Tailwind classes (bg-green-*, text-emerald-*)
2. Add !important overrides in globals.css
3. Clear browser cache and hard refresh
4. Verify CSS custom properties are loaded

#### Mobile Layout Issues
**Problem**: Layout breaks on mobile devices

**Solutions**:
1. Use responsive Tailwind classes (sm:, md:, lg:)
2. Test with browser dev tools mobile view
3. Ensure touch targets are at least 44px
4. Check for horizontal overflow

### Geolocation Issues

#### Location Access Denied
**Problem**: Browser blocks geolocation request

**Solutions**:
1. Provide manual city selection fallback
2. Show clear permission request message
3. Handle error gracefully with default city
4. Test in different browsers (Chrome, Firefox, Safari)

#### Inaccurate Location
**Problem**: Geolocation returns wrong city

**Solutions**:
1. Implement city correction interface
2. Allow manual city override
3. Use IP-based fallback location
4. Cache user's preferred city

### Performance Issues

#### Slow Database Queries
**Problem**: Search results take too long to load

**Solutions**:
1. Add database indexes on frequently queried columns
2. Use LIMIT clauses on all public queries
3. Implement pagination for large result sets
4. Cache frequently accessed data

#### Large Bundle Size
**Problem**: JavaScript bundle is too large

**Solutions**:
1. Use dynamic imports for heavy components
2. Optimize images with Next.js Image component
3. Remove unused dependencies
4. Enable tree shaking in build process

### Search Issues

#### No Results Found
**Problem**: Search returns empty results

**Solutions**:
1. Check if test data exists in database
2. Verify search query syntax (ILIKE patterns)
3. Test with simpler search terms
4. Check RLS policies aren't filtering results

#### Incorrect Results
**Problem**: Search returns irrelevant results

**Solutions**:
1. Improve search query with better ILIKE patterns
2. Add relevance scoring to queries
3. Implement search result ranking
4. Add search filters for better targeting

## Debug Commands

### Database Inspection
\`\`\`sql
-- Check table structure
\d table_name

-- Count records
SELECT COUNT(*) FROM table_name;

-- Check foreign key relationships
SELECT * FROM information_schema.table_constraints 
WHERE constraint_type = 'FOREIGN KEY';

-- Test RLS policies
SET ROLE authenticated;
SELECT * FROM table_name;
\`\`\`

### Client-side Debugging
\`\`\`javascript
// Check Supabase connection
console.log('[v0] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)

// Debug geolocation
navigator.geolocation.getCurrentPosition(
  pos => console.log('[v0] Location:', pos.coords),
  err => console.log('[v0] Geolocation error:', err)
)

// Check authentication state
const { data: { user } } = await supabase.auth.getUser()
console.log('[v0] Current user:', user)
\`\`\`

### Performance Monitoring
\`\`\`javascript
// Measure query performance
console.time('[v0] Database query')
const { data } = await supabase.from('table').select()
console.timeEnd('[v0] Database query')

// Monitor component renders
useEffect(() => {
  console.log('[v0] Component rendered:', componentName)
})
\`\`\`

## Emergency Procedures

### Database Recovery
1. **Backup current state** before making changes
2. **Use transactions** for multi-table operations
3. **Test on staging** before production changes
4. **Keep migration scripts** for rollback capability

### Site Down
1. **Check Vercel status** and deployment logs
2. **Verify Supabase connection** and database health
3. **Test critical user flows** after recovery
4. **Monitor error rates** for 24 hours post-incident

### Data Corruption
1. **Stop all write operations** immediately
2. **Identify scope** of affected data
3. **Restore from backup** if available
4. **Implement data validation** to prevent recurrence
