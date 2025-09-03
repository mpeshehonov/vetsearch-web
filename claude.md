# ВетПоиск - Claude AI Instructions

## Project Overview
ВетПоиск is a veterinary services search platform that helps pet owners find verified veterinary clinics and doctors with real customer reviews. Users can search by location, read reviews, and book appointments online.

## Technology Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Deployment**: Vercel
- **Geolocation**: Browser Geolocation API

## Brand Identity
- **Name**: ВетПоиск (VetSearch)
- **Logo**: Stylized cat icon (CatIcon component)
- **Color Scheme**: Light orange/amber theme (oklch(0.65 0.15 45))
- **Language**: Russian

## Architecture & Project Structure

### Key Directories
\`\`\`
app/                    # Next.js App Router pages
├── page.tsx           # Main search platform
├── for-clinics/       # Landing page for clinics
├── auth/              # Authentication pages
├── clinic/[id]/       # Clinic detail pages
├── doctor/[id]/       # Doctor detail pages
├── book-appointment/  # Appointment booking
├── dashboard/         # User dashboard
└── admin/             # Admin panel

components/            # Reusable components
├── ui/               # shadcn/ui components
├── navigation/       # Navigation components
├── city-selector.tsx # City selection with geolocation
├── geolocation-provider.tsx
└── review-*.tsx      # Review system components

lib/
├── supabase/         # Supabase client configuration
└── utils.ts          # Utility functions

scripts/              # Database migration scripts
\`\`\`

### Database Schema (Supabase)
- `cities` - Russian cities with coordinates
- `clinics` - Veterinary clinics
- `services` - Available services
- `profiles` - User profiles (veterinarians, admins)
- `pet_owners` - Pet owners information
- `pets` - Pet information
- `appointments` - Appointment bookings
- `reviews` - Clinic/doctor reviews
- `clinic_veterinarians` - Clinic-doctor relationships
- `clinic_services` - Clinic-service relationships

## Critical Development Rules

### YOU MUST ALWAYS:
1. **Read files before editing** using SearchRepo or ReadFile
2. **Use semantic color tokens** (primary, accent, etc.) instead of hardcoded colors
3. **Maintain orange/amber brand colors** - never use green/emerald
4. **Support Russian language** in all user-facing content
5. **Handle geolocation gracefully** with fallbacks
6. **Validate Supabase queries** and handle errors properly

### Color System Rules
- Primary: `oklch(0.65 0.15 45)` (amber)
- Accent: `oklch(0.75 0.12 45)` (orange)
- NEVER use green/emerald colors anywhere
- Use CSS custom properties for theming

### Database Rules
- All user-facing content must be in Russian
- Use RLS (Row Level Security) policies
- Handle foreign key constraints carefully
- Always check for existing data before inserting

## Key Development Commands
\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run type-check   # TypeScript checking
\`\`\`

## Critical Workflows

### Adding New Features
1. Check current database schema with GetOrRequestIntegration
2. Read existing components before creating new ones
3. Follow established patterns for Supabase queries
4. Test geolocation functionality
5. Ensure mobile responsiveness

### Database Changes
1. Create migration scripts in `/scripts` folder
2. Test with sample data
3. Update TypeScript interfaces
4. Handle foreign key relationships properly

### Styling Changes
1. Use semantic tokens from globals.css
2. Test both light and dark themes
3. Ensure accessibility (WCAG AA)
4. Maintain consistent spacing (Tailwind classes)

## Supabase Integration

### Client Configuration
- Browser client: `lib/supabase/client.ts`
- Server client: `lib/supabase/server.ts`
- Middleware: `lib/supabase/middleware.ts`

### Environment Variables Required
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Authentication Flow
- Registration without email confirmation required
- Role-based access (veterinarian, admin, user)
- Protected routes: `/dashboard`, `/admin`
- Public routes: `/`, `/clinic/*`, `/doctor/*`, `/book-appointment`

## Component Guidelines

### UI Components (shadcn/ui)
- Use existing components from `components/ui/`
- Customize via Tailwind classes, not direct CSS
- Maintain consistent sizing and spacing

### Custom Components
- `CitySelector` - Handles geolocation and city selection
- `GeolocationProvider` - Provides location context
- Review system components for ratings and feedback

## Debugging Instructions
- Use `console.log("[v0] ...")` for debugging
- Check Supabase logs for database errors
- Verify environment variables are loaded
- Test geolocation in different browsers

## DO NOT TOUCH
- `components/ui/*` - Core shadcn/ui components
- `app/globals.css` color variables (without approval)
- Supabase RLS policies (without testing)
- Core authentication middleware logic

## Current Status
- ✅ Basic search functionality
- ✅ Geolocation and city selection
- ✅ Clinic and doctor detail pages
- ✅ Review system
- ✅ Appointment booking
- ✅ Admin dashboard
- ✅ Orange/amber branding
- 🔄 Database populated with test data
- 🔄 Mobile optimization ongoing

## Future Roadmap
- Enhanced search filters
- Real-time notifications
- Payment integration
- Mobile app development
- Advanced analytics for clinics
