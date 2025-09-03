# ВетПоиск - Agent Context

## Project Context
ВетПоиск is a veterinary services search platform similar to "ПроДокторов" but specifically for veterinary clinics and doctors in Russia. The platform has evolved from a single clinic management system to a multi-clinic search platform.

## Brand Evolution
- **Original**: Green-themed veterinary clinic management system
- **Current**: Orange/amber-themed "ВетПоиск" search platform
- **Logo**: Changed from heart icon to cat icon (CatIcon component)

## Key Business Logic

### Search Functionality
- Users search by city (auto-detected via geolocation)
- Two search modes: "Клиники" (Clinics) and "Врачи" (Doctors)
- Results show ratings, reviews, and booking options

### User Roles
- **Pet Owners**: Can search, read reviews, book appointments
- **Veterinarians**: Manage profiles, view appointments
- **Admins**: Full system management
- **Clinic Owners**: Manage clinic information and services

### Appointment System
- Public booking without authentication required
- Three-step process: Select doctor/service → Choose date/time → Enter details
- Supports both clinic-based and doctor-specific bookings

## Technical Decisions

### Why Supabase?
- Real-time capabilities for appointment updates
- Built-in authentication with role management
- PostgreSQL with advanced features (JSON, geolocation)
- Row Level Security for data protection

### Why Next.js 15?
- App Router for better performance and SEO
- Server-side rendering for search pages
- API routes for backend functionality
- Excellent TypeScript support

### Color System Philosophy
- Orange/amber represents warmth and care for pets
- Avoids medical "cold" colors like blue
- Differentiates from competitors using green/blue themes

## Data Relationships

### Core Entities
\`\`\`
Cities → Clinics → Services
       → Veterinarians → Appointments
                      → Reviews
Pet Owners → Pets → Appointments
\`\`\`

### Important Constraints
- `appointments.veterinarian_id` is required (NOT NULL)
- `profiles.id` must exist in `auth.users` (foreign key)
- `reviews` can be for clinics or individual doctors
- `cities` table contains Russian cities with coordinates

## Common Patterns

### Supabase Queries
\`\`\`typescript
// Always handle errors
const { data, error } = await supabase.from('table').select()
if (error) throw error

// Use RLS-friendly queries
.eq('user_id', user.id) // For user-specific data
.eq('is_active', true)  // For public listings
\`\`\`

### Component Structure
\`\`\`typescript
// Always use proper TypeScript interfaces
interface ComponentProps {
  data: DatabaseType
  onAction: (id: string) => void
}

// Handle loading and error states
const [loading, setLoading] = useState(false)
const [error, setError] = useState<string | null>(null)
\`\`\`

## Performance Considerations
- Use `limit()` on all public queries
- Implement pagination for large result sets
- Cache city data in localStorage
- Optimize images with Next.js Image component
- Use React.memo for expensive components

## Security Guidelines
- Never expose service role key in client code
- Always validate user permissions server-side
- Use RLS policies for data access control
- Sanitize user inputs before database queries
- Implement rate limiting for public APIs
