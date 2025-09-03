# Development Workflows

## Adding New Features

### 1. Database Changes
\`\`\`bash
# Check current schema
GetOrRequestIntegration → Supabase

# Create migration script
scripts/XXX_feature_name.sql

# Test with sample data
# Apply via Supabase dashboard or v0 script runner
\`\`\`

### 2. Component Development
\`\`\`bash
# Read existing components first
SearchRepo → "components/similar-component"

# Follow established patterns
- Use TypeScript interfaces
- Handle loading/error states
- Implement proper accessibility
- Test mobile responsiveness
\`\`\`

### 3. Page Creation
\`\`\`bash
# Structure: app/feature/page.tsx
# Include:
- Proper metadata
- Error boundaries
- Loading states
- SEO optimization
\`\`\`

## Database Workflow

### Schema Updates
1. **Plan**: Document changes in comments
2. **Create**: Write migration script with proper foreign keys
3. **Test**: Use sample data to verify relationships
4. **Apply**: Run script via v0 interface
5. **Verify**: Check schema with GetOrRequestIntegration

### Data Population
1. **Order matters**: Insert in dependency order
   - Cities → Clinics → Services → Veterinarians → Appointments
2. **Use transactions**: Wrap related inserts in BEGIN/COMMIT
3. **Handle conflicts**: Use ON CONFLICT clauses appropriately
4. **Validate**: Check foreign key constraints

## Styling Workflow

### Color Updates
1. **Check globals.css**: Verify current color tokens
2. **Use semantic tokens**: primary, accent, muted, etc.
3. **Test both themes**: Light and dark mode
4. **Override specifics**: Use !important for stubborn components

### Component Styling
1. **Use Tailwind classes**: Avoid custom CSS when possible
2. **Follow spacing scale**: Use consistent spacing (4, 8, 16, 24px)
3. **Responsive design**: Mobile-first approach
4. **Accessibility**: Ensure proper contrast ratios

## Testing Workflow

### Manual Testing Checklist
- [ ] Geolocation works in different browsers
- [ ] Search returns relevant results
- [ ] Appointment booking completes successfully
- [ ] Reviews display and submit correctly
- [ ] Mobile layout is responsive
- [ ] Authentication flows work properly

### Database Testing
- [ ] All foreign keys resolve correctly
- [ ] RLS policies allow/deny appropriate access
- [ ] Queries perform well with sample data
- [ ] Indexes support common query patterns

## Deployment Workflow

### Pre-deployment
1. **Test locally**: Ensure all features work
2. **Check environment**: Verify all env vars are set
3. **Database ready**: Confirm schema and data are current
4. **Build passes**: No TypeScript or build errors

### Post-deployment
1. **Smoke test**: Check critical user flows
2. **Monitor logs**: Watch for runtime errors
3. **Performance check**: Verify page load times
4. **Database health**: Monitor query performance

## Debugging Workflow

### Client-side Issues
1. **Browser console**: Check for JavaScript errors
2. **Network tab**: Verify API calls and responses
3. **React DevTools**: Inspect component state
4. **Geolocation**: Test in different browsers/devices

### Server-side Issues
1. **Supabase logs**: Check database query errors
2. **Vercel logs**: Monitor serverless function errors
3. **Environment vars**: Verify all required vars are set
4. **Database connections**: Check connection limits

### Common Issues
- **Geolocation blocked**: Provide manual city selection
- **Supabase timeout**: Implement retry logic
- **Foreign key errors**: Check data relationships
- **Color inconsistencies**: Verify CSS custom properties
