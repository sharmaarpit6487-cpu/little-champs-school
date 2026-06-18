# Little Champs School — Management Platform

A premium school website combined with a full-featured School ERP system. Built for **Little Champs School** with modern UI/UX, role-based access control, and production-ready architecture.

## Features

### Public Website
- Animated hero sections with Framer Motion
- Home, About, Academics, Admissions, Gallery, News & Events, Faculty, Contact
- Glassmorphism design with Navy Blue, White, and Gold accents
- Dark/Light mode, fully responsive
- Online admission form, contact form, interactive gallery
- SEO optimized with Next.js App Router

### School ERP (Admin Application)
- Dashboard with analytics and revenue charts
- Student management (CRUD, search, profiles)
- Fee management (tuition, transport, exam fees)
- Payment tracking with receipt generation
- Attendance management
- Teacher management
- Admission application review
- Events & announcements management
- Reports export (Excel/PDF)
- Audit logs for GDPR compliance

### Portals
- **Parent Portal**: View child info, fee status, download receipts, announcements
- **Student Portal**: Profile, attendance, grades, notices, documents

### Security
- NextAuth JWT authentication
- Role-based access control (Super Admin, Admin, Teacher, Accountant, Parent, Student)
- Input validation with Zod
- Audit logging
- Secure API routes

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + ShadCN UI
- **Animations**: Framer Motion
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: NextAuth.js
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Clone and enter project
cd little-champs-school

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Environment Setup

Edit `.env` with your values:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/little_champs_school?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secure-random-string-here"
```

Generate a secret:
```bash
openssl rand -base64 32
```

### Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed sample data
npm run db:seed
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Credentials

| Role    | Email                      | Password    |
|---------|----------------------------|-------------|
| Admin   | admin@littlechamps.edu     | admin123    |
| Parent  | parent@example.com         | parent123   |
| Student | student@example.com      | student123  |

## Project Structure

```
little-champs-school/
├── prisma/
│   ├── schema.prisma      # Database models
│   └── seed.ts            # Sample data
├── public/
│   └── uploads/           # File uploads
├── src/
│   ├── app/
│   │   ├── (public)/      # Public website pages
│   │   ├── api/           # API routes
│   │   ├── erp/           # School ERP admin app
│   │   ├── portal/        # Parent & student portals
│   │   └── login/         # Authentication
│   ├── components/
│   │   ├── ui/            # ShadCN components
│   │   ├── layout/        # Navbar, Footer
│   │   ├── erp/           # ERP-specific components
│   │   └── shared/        # Reusable components
│   └── lib/
│       ├── auth.ts        # NextAuth config & RBAC
│       ├── prisma.ts      # Database client
│       ├── validations.ts # Zod schemas
│       ├── audit.ts       # Audit logging
│       ├── email.ts       # Email notifications
│       └── export.ts      # Report exports
└── README.md
```

## Database Models

- Users, Students, Parents, Teachers
- Classes, Subjects, Attendance, Grades
- Fees, FeePayments, Invoices
- Events, Announcements, Admissions
- AuditLog, ActivityLog, GalleryItem, BlogPost

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Use [Neon](https://neon.tech) or [Supabase](https://supabase.com) for PostgreSQL
5. Deploy

```bash
# Build for production
npm run build
npm start
```

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables for Production

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_URL` | Your production URL |
| `NEXTAUTH_SECRET` | Secure random string |
| `SMTP_*` | Email configuration (optional) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps (optional) |

## API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/[...nextauth]` | GET/POST | Authentication |
| `/api/students` | GET/POST | List/create students |
| `/api/students/[id]` | GET/PUT/DELETE | Student CRUD |
| `/api/fees` | GET/POST | Fee management |
| `/api/fees/payments` | POST | Record payment |
| `/api/admissions` | GET/POST | Admission applications |
| `/api/contact` | POST | Contact form |

## Customization

### School Information
Edit `src/lib/school-data.ts` to update:
- School name, contact details, principal message
- Achievements, facilities, fee structure
- Navigation links, academic calendar

### Theme Colors
Modify CSS variables in `src/app/globals.css`:
- Navy: `--navy`
- Gold: `--gold`

## License

Private — Little Champs School
