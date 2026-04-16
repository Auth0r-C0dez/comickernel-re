# Play India Lottery - Live Result Chart

## Overview

Play India Lottery is a modern, responsive web application for viewing and managing daily lottery results. Built with Next.js 16, React 19, and TypeScript, it offers a real-time result chart with admin capabilities for managing lottery drawings.

## Features

### User Features
- **Live Result Display**: Real-time lottery results displayed in an organized table format
- **Date Selection**: Browse results for any selected date with intuitive date picker
- **Responsive Design**: Full mobile responsiveness with swipe support for horizontal scrolling
- **Light/Dark Theme**: Switch between light (default) and dark themes with persistent preference storage
- **Visitor Tracking**: Anonymous visitor identification using localStorage

### Admin Features
- **Admin Portal**: Secured access with password protection
- **Data Management**: Add, edit, and delete lottery results
- **Time Formatting**: Auto-format time input to HH:MM AM/PM format
- **Real-time Updates**: Changes reflected immediately across the application

## Tech Stack

### Frontend
- **Next.js 16.2.4**: React framework with server components
- **React 19.2.4**: UI library
- **TypeScript 5**: Type safety
- **Tailwind CSS**: Utility-first styling (via inline classes)
- **Lucide React 1.8.0**: Icon library

### Backend
- **Node.js**: Server runtime
- **Turso/LibSql**: SQLite database with remote sync capability
- **Next.js Server Actions**: Server-side data mutations

### Development Tools
- **ESLint**: Code linting
- **Next.js ESLint Config**: Framework-specific linting rules

## Project Structure

```
comickernel/
├── src/
│   ├── app/
│   │   ├── actions.ts              # Server actions for database operations
│   │   ├── globals.css             # Global styles with theme variables
│   │   ├── layout.tsx              # Root layout with theme provider
│   │   ├── page.tsx                # Main home page
│   │   ├── page.module.css         # Page-specific styles
│   │   └── debug/
│   │       └── page.tsx            # Debug page
│   ├── components/
│   │   ├── AdminPortal.tsx         # Admin login interface
│   │   ├── ResultTable.tsx         # Lottery results table
│   │   ├── VisitorId.tsx           # Visitor ID display
│   │   ├── ThemeProvider.tsx       # Theme context and toggle
│   │   └── TimeInput.tsx           # Time input with auto-formatting
│   └── lib/
│       └── db.ts                   # Database client and types
├── public/                          # Static assets
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
├── next.config.ts                   # Next.js configuration
├── eslint.config.mjs                # ESLint configuration
├── schema.sql                       # Database schema
└── setup-db.mjs                     # Database initialization script
```

## Key Components

### ThemeProvider (`src/components/ThemeProvider.tsx`)
- Context-based theme management
- Persists user preference to localStorage
- Provides `useTheme()` hook and `ThemeToggle` button component
- Default theme: Light
- Supports: Light and Dark modes

**Usage**:
```tsx
import { useTheme, ThemeToggle } from '@/components/ThemeProvider';

// In components
const { theme, toggleTheme } = useTheme();

// Add toggle button
<ThemeToggle />
```

### TimeInput (`src/components/TimeInput.tsx`)
- Auto-formats user input to HH:MM format
- Separate hour and minute inputs with validation
- AM/PM selector buttons
- Mobile-friendly design

**Props**:
- `value: string` - Current time value (HH:MM AM/PM format)
- `onChange: (value: string) => void` - Callback on time change
- `placeholder?: string` - Placeholder text (default: "HH:MM AM")

**Features**:
- Validates hour (0-12) and minute (0-59) ranges
- Auto-advances between hour and minute inputs
- Separate AM/PM toggle buttons

### ResultTable (`src/components/ResultTable.tsx`)
- Displays lottery results in a responsive table
- Admin edit/delete functionality with inline editing
- Add new results directly from the table
- Horizontal scroll on mobile with swipe gesture detection
- Sticky timestamp column for easy reference

**Props**:
- `initialResults: LotteryResult[]` - Array of lottery results
- `date: string` - Selected date for results
- `adminMode: boolean` - Enable admin controls

### AdminPortal (`src/components/AdminPortal.tsx`)
- Password-protected admin access
- 5 rapid Escape key presses or clicks to trigger login
- Secure cookie-based session management
- Admin logout button

**Authentication**:
- Uses environment variable `ADMIN_PASSWORD`
- Session stored in httpOnly cookie with 24-hour expiry
- Secure flag enabled in production

### VisitorId (`src/components/VisitorId.tsx`)
- Generates unique visitor ID on first visit
- Format: `UID-{10-digit-alphanumeric}`
- Stored in browser localStorage

## Styling System

### Theme Variables
The application uses CSS custom properties for theming:

**Light Theme (Default)**:
```css
--bg-deep: #ffffff
--text-primary: #1a1a1a
--text-secondary: #666666
--accent: #f0f0f0
--border: rgba(0, 0, 0, 0.08)
--glass-bg: rgba(255, 255, 255, 0.7)
```

**Dark Theme**:
```css
--bg-deep: #030303
--text-primary: #e8e8e8
--text-secondary: #888888
--accent: #333333
--border: rgba(255, 255, 255, 0.08)
--glass-bg: rgba(16, 16, 16, 0.5)
```

### Responsive Breakpoints
- **Desktop**: 1024px+ (single row layout)
- **Tablet**: 768px - 1023px (adjusted spacing)
- **Mobile**: 480px - 767px (stacked layout, full width controls)
- **Small Mobile**: < 480px (minimal padding, optimized for touch)

### Utility Classes
- `.container`: Responsive container (92% width, max-width: 1100px)
- `.glass`: Glassmorphism effect with blur and transparency
- `.btn`, `.btn-sm`, `.btn-ghost`: Button variants
- `.force-spacer`: Consistent vertical spacing
- `.scroll-lock`: Horizontal scroll container
- `.sticky-col`: Sticky column for tables

## Database Schema

### Results Table
```sql
CREATE TABLE results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  draw_time TEXT NOT NULL,
  sangam TEXT,
  chetak TEXT,
  super TEXT,
  mp_deluxe TEXT,
  bhagya_rekha TEXT,
  diamond TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Supported Lotteries**:
- Sangam
- Chetak
- Super
- MP Deluxe
- Bhagya Rekha
- Diamond

## Server Actions (`src/app/actions.ts`)

### `loginAdmin(password: string)`
Authenticates admin user with password, sets secure session cookie.

### `logoutAdmin()`
Clears admin session and revalidates the page.

### `isAdmin()`
Checks if current request has valid admin session cookie.

### `getResults(date: string)`
Fetches lottery results for specified date, returns array of LotteryResult.

### `upsertResult(data: LotteryResult)`
Creates new or updates existing lottery result (admin only).

### `deleteResult(id: number)`
Deletes lottery result by ID (admin only).

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd comickernel
```

2. **Install dependencies**:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**:
Create a `.env.local` file:
```env
# Database Configuration
TURSO_DATABASE_URL=file:local.db  # SQLite for development
TURSO_AUTH_TOKEN=                 # Leave empty for local SQLite

# Admin Configuration
ADMIN_PASSWORD=admin123           # Change this!
```

4. **Initialize the database**:
```bash
node setup-db.mjs
```

### Development

Run the development server:
```bash
npm run dev
```

Access at `http://localhost:3000`

### Production Build

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Usage Guide

### Viewing Results
1. **Select Date**: Use the date picker in the control bar to select a date
2. **Search**: Click "Search" button to load results for that date
3. **Browse**: Table displays all lottery draws for the selected date
4. **Switch Theme**: Use the theme toggle button (Moon/Sun icon) in the footer

### Admin Operations

#### Logging In
1. Press Escape key 5 times rapidly (or click the page 5 times)
2. Security modal appears
3. Enter the admin password
4. Click "Log In"

#### Adding Results
1. Scroll to bottom of results table
2. Click "Add New Row" button
3. Fill in all fields:
   - **Timestamp**: Enter time in any format, auto-formats to HH:MM AM/PM
   - **Results**: Enter lottery numbers
4. Click green checkmark to save

#### Editing Results
1. Hover over a result row
2. Click edit icon (pencil) to enter edit mode
3. Modify any fields
4. Click green checkmark to save or red X to cancel

#### Deleting Results
1. Hover over a result row
2. Click delete icon (trash) 
3. Confirm deletion in popup

#### Logging Out
1. Click "Log Out" button in footer (visible only in admin mode)
2. Admin access revoked, session cleared

## Mobile Experience

### Responsive Features
- **Full-screen layout** on all devices
- **Touch-friendly controls** with adequate padding
- **Horizontal swipe support** for table navigation
- **Date picker** adapts to mobile input types
- **Stacked layout** on small screens (< 768px)

### Time Input on Mobile
- **Hour/Minute fields**: Large, touch-friendly inputs
- **AM/PM buttons**: Easy-to-tap toggle buttons
- **Auto-format**: Handles various input formats intelligently

### Table Navigation
- **Scroll horizontally** on small screens
- **Sticky timestamp column** always visible
- **Full-width rows** ensure readability
- **Touch swipe detection** for gesture support

## Security Considerations

### Admin Security
- **Password-based authentication**: Change `ADMIN_PASSWORD` in production
- **HTTPOnly cookies**: Session tokens not accessible to JavaScript
- **Secure flag**: Cookies only sent over HTTPS in production
- **24-hour expiry**: Sessions automatically expire after 24 hours

### Data Protection
- **Server-side validation**: Only authenticated admins can modify data
- **Revalidation**: Cache revalidated after data changes
- **Error handling**: Graceful error messages without exposing internals

## Customization

### Adding New Lotteries
1. Update `schema.sql` to add new column (e.g., `new_lottery TEXT`)
2. Update `LotteryResult` type in `src/lib/db.ts`
3. Update column header in `ResultTable.tsx`
4. Update upsert/insert queries in `src/app/actions.ts`

### Changing Default Theme
In `ThemeProvider.tsx`, change the default state:
```tsx
const [theme, setTheme] = useState<Theme>('dark'); // Change 'light' to 'dark'
```

### Customizing Colors
Update the CSS variables in `globals.css`:
```css
[data-theme="light"] {
  --bg-deep: #your-color;
  --text-primary: #your-color;
  /* ... other variables ... */
}
```

## Performance Optimization

### Current Optimizations
- **Server-side rendering**: Reduces client-side computation
- **Min-height 100vh**: Prevents layout shift
- **CSS variables**: Efficient theme switching without re-renders
- **Image optimization**: Lucide React provides inline SVGs
- **Lazy loading**: Next.js automatic code splitting

### Recommendations for Scale
- Implement result pagination (currently loads all results)
- Add database indexing on `date` and `draw_time` columns
- Consider caching strategy for historical results
- Use CDN for static assets

## Troubleshooting

### Theme Not Persisting
- Check browser localStorage is enabled
- Clear browser cache and reload
- Check browser console for errors

### Admin Access Not Working
- Verify `ADMIN_PASSWORD` environment variable is set
- Check browser cookies are enabled
- Try pressing Escape 5 times rapidly
- Check that exact key count reaches 5 (may vary on different keyboards)

### Database Connection Issues
- For Turso remote: Verify `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`
- For local SQLite: Ensure `setup-db.mjs` has been run
- Check file permissions on `local.db`

### Mobile Layout Issues
- Ensure viewport meta tag is in HTML (automatically added by Next.js)
- Test on actual device or Chrome DevTools device emulation
- Check that `overflow-x: hidden` is applied to body

## Deployment

### Environment Setup for Production
```bash
# Set secure admin password
ADMIN_PASSWORD=your_secure_password_here

# For Turso database
TURSO_DATABASE_URL=https://your-database-url.turso.io
TURSO_AUTH_TOKEN=your_auth_token_here

# Next.js settings
NODE_ENV=production
```

### Deployment Platforms
- **Vercel** (Recommended for Next.js): Push to GitHub, auto-deploy
- **Railway**: Connect repository, configure environment variables
- **Render**: Similar setup to Railway
- **Self-hosted**: Use `npm run build && npm start`

## Contributing

To contribute improvements:
1. Create a feature branch
2. Make changes following existing code style
3. Test on mobile and desktop
4. Submit pull request with description

## License

[Specify your license here]

## Support

For issues or questions:
- Check existing issues in repository
- Review this documentation
- Contact administration

## Changelog

### Version 0.1.0 (Initial Release)
- Live lottery results display
- Light/Dark theme support
- Admin panel with password protection
- Responsive mobile design
- Time auto-formatting
- Real-time updates with server actions

---

**Last Updated**: April 16, 2026
**Maintainer**: [Your name/team]
