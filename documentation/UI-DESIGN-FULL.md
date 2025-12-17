# Chronos Timetable Management System - Complete UI Design

## Design Philosophy

A clean, professional interface built for clarity and systematic organization. Dark mode primary with light mode support. texture-rich interface that emphasizes depth and materiality over flat design. Atmospheric backgrounds create immersion while maintaining clarity and usability. The Chronos brand identity combines modern scheduling with timeless organization.

---

## Branding Identity

### Logo Design

**5×3 Grid Pattern (40px × 24px):**

**Dark Mode Blocks:**

```
Row 1: [Indigo] [Indigo] [Indigo] [Silver] [White]
Row 2: [Indigo] [White] [Indigo] [Silver] [White]
Row 3: [White] [Indigo] [Silver] [Indigo] [White]

Indigo: #6731b7
Silver: #c3c3c3
White: #ffffff
```

**Light Mode Blocks:**

```
Row 1: [Sage] [Sage] [Sage] [Slate] [Forest]
Row 2: [Sage] [Forest] [Sage] [Slate] [Forest]
Row 3: [Forest] [Sage] [Slate] [Sage] [Forest]

Sage: #5a7a5f
Slate: #7591a3
Forest: #1f2d1f
```

### Wordmark

- **Text:** "CHRONOS"
- **Font:** Dongle Bold, 24px (matches grid height)
- **Position:** 12px right of grid
- **Dark Mode:** #ffffff
- **Light Mode:** #1f2d1f

### Tagline

- **Text:** "Time, Organized"
- **Font:** Manrope Regular, 14px
- **Dark Mode:** #808080
- **Light Mode:** #8a9a8f

---

## Color System

### Dark Mode (Primary Interface)

**Backgrounds:**

- Main Canvas: #0a0a0a
- Surface (cards, modals): #1a1a1a
- Elevated (hover, dropdowns): #222222

**Accents:**

- Primary (CTAs, active): #6731b7
- Secondary (borders, hover): #523e93
- Light (badges, highlights): #9975cd

**Text:**

- Primary: #ffffff
- Secondary: #c3c3c3
- Muted: #808080

**Borders:**

- Subtle: #2a2a2a
- Prominent: #3a3a3a

**Semantic:**

- Success: #4caf50
- Warning: #ff9800
- Error: #f44336
- Info: #2196f3

### Light Mode

**Backgrounds:**

- Main Canvas: #faf9f5
- Surface: #ffffff
- Elevated: #e8ebe6

**Accents:**

- Primary: #5a7a5f
- Secondary: #7591a3

**Text:**

- Primary: #1f2d1f
- Secondary: #4a5a4f
- Muted: #8a9a8f

**Semantic:**

- Success: #2d7a3e
- Warning: #b8860b
- Error: #b44336
- Info: #2563a8

---

## Typography

### Font Families

- **Logo:** Dongle Bold (24px only)
- **Headings:** Comfortaa (400, 500, 600, 700)
- **Body/UI:** Manrope (300, 400, 500, 600, 700)

### Type Scale

**Dark Mode:**

```
Hero: 56px / Comfortaa Bold / #ffffff / 1.1 line-height
H1: 40px / Comfortaa Semibold / #ffffff / 1.2
H2: 32px / Comfortaa Semibold / #ffffff / 1.3
H3: 24px / Comfortaa Medium / #ffffff / 1.4
H4: 20px / Comfortaa Medium / #ffffff / 1.5
Body Large: 18px / Manrope Regular / #c3c3c3 / 1.6
Body: 16px / Manrope Regular / #c3c3c3 / 1.6
Small: 14px / Manrope Regular / #c3c3c3 / 1.5
Caption: 12px / Manrope Medium / #808080 / 1.4
```

**Light Mode:**

```
Hero: 56px / Comfortaa Bold / #1f2d1f / 1.1
H1: 40px / Comfortaa Semibold / #1f2d1f / 1.2
H2: 32px / Comfortaa Semibold / #1f2d1f / 1.3
H3: 24px / Comfortaa Medium / #1f2d1f / 1.4
H4: 20px / Comfortaa Medium / #1f2d1f / 1.5
Body Large: 18px / Manrope Regular / #4a5a4f / 1.6
Body: 16px / Manrope Regular / #4a5a4f / 1.6
Small: 14px / Manrope Regular / #4a5a4f / 1.5
Caption: 12px / Manrope Medium / #8a9a8f / 1.4
```

---

## Component Specifications

### 1. Navigation Bar

**Top Bar (Dark Mode):**

```
Height: 64px
Background: #1a1a1a
Border-bottom: 1px solid #2a2a2a
Shadow: 0 2px 8px rgba(0, 0, 0, 0.2)

Left: CHRONOS logo
Right: Bell icon, Settings icon, User menu
```

**Top Bar (Light Mode):**

```
Height: 64px
Background: #ffffff
Border-bottom: 1px solid #e8ebe6
Shadow: 0 2px 8px rgba(0, 0, 0, 0.1)

Left: CHRONOS logo
Right: Bell icon, Settings icon, User menu
```

**Sidebar (Dark Mode):**

```
Width: 280px expanded / 72px collapsed
Background: #0a0a0a
Border-right: 1px solid #2a2a2a

Toggle Button:
  Position: absolute -right-3 top-24px
  Size: 32px circle
  Background: #1a1a1a
  Border: 1px solid #2a2a2a
  Icon: ChevronLeft 20px #c3c3c3
  Rotates 180° when collapsed
```

**Sidebar Item (Dark - Default):**

```
Padding: 12px 16px
Border-radius: 8px
Icon: 20px left
Text: Manrope Medium 15px #c3c3c3
Background: transparent

Hover: background rgba(255,255,255,0.05)
```

**Sidebar Item (Dark - Active):**

```
Background: rgba(103, 49, 183, 0.15)
Text: #9975cd
Border-left: 2px solid #6731b7
```

**Sidebar (Light Mode):**

```
Width: 280px expanded / 72px collapsed
Background: #faf9f5
Border-right: 1px solid #e8ebe6

Toggle Button:
  Background: #ffffff
  Border: 1px solid #e8ebe6
  Icon: ChevronLeft 20px #4a5a4f
```

**Sidebar Item (Light - Active):**

```
Background: rgba(90, 122, 95, 0.1)
Text: #5a7a5f
Border-left: 2px solid #5a7a5f
```

---

### 2. Buttons

**Primary Button (Dark):**

```
Background: #6731b7
Hover: #523e93
Text: #ffffff
Padding: 12px 24px
Border-radius: 8px
Font: Manrope Semibold 15px
Shadow: 0 2px 8px rgba(103, 49, 183, 0.3)

Hover: translateY(-1px) + shadow 0 4px 16px
```

**Primary Button (Light):**

```
Background: #5a7a5f
Hover: #4a6a50
Text: #ffffff
Shadow: 0 2px 8px rgba(90, 122, 95, 0.25)
```

**Secondary Button (Dark):**

```
Background: transparent
Border: 1px solid #3a3a3a
Text: #c3c3c3
Hover: background rgba(255,255,255,0.05)
```

**Secondary Button (Light):**

```
Background: transparent
Border: 1px solid #e8ebe6
Text: #4a5a4f
Hover: background rgba(0,0,0,0.05)
```

**Icon-Only Button (Dark):**

```
Size: 40px × 40px
Background: transparent
Icon: 20px #c3c3c3
Border-radius: 8px
Hover: background rgba(255,255,255,0.08), icon #ffffff

Examples: Edit2, Trash2, Filter, Search, Bell, Settings
Always include aria-label
```

**Icon-Only Button (Light):**

```
Size: 40px × 40px
Icon: 20px #4a5a4f
Hover: background rgba(0,0,0,0.05), icon #1f2d1f
```

---

### 3. Input Fields

**Text Input (Dark):**

```
Background: #1a1a1a
Border: 1px solid #2a2a2a
Border-radius: 8px
Padding: 12px 16px
Text: #ffffff Manrope Regular 15px
Placeholder: #808080

Focus:
  Border: #6731b7
  Ring: 0 0 0 2px rgba(103, 49, 183, 0.2)
  Background: #1f1f1f
```

**Label (Dark):**

```
Font: Manrope Medium 14px
Color: #ffffff
Margin-bottom: 8px
```

**Text Input (Light):**

```
Background: #ffffff
Border: 1px solid #e8ebe6
Text: #1f2d1f
Placeholder: #8a9a8f

Focus:
  Border: #5a7a5f
  Ring: 0 0 0 2px rgba(90, 122, 95, 0.2)
```

**Label (Light):**

```
Color: #1f2d1f
```

**Password Input:**

- Same as text input
- Eye icon button (20px) in right padding
- Toggles between Eye and EyeOff icons

**Dropdown/Select:**

- Same styling as text input
- ChevronDown icon (16px) in right padding
- Dropdown panel appears below with same width

---

### 4. Cards

**Standard Card (Dark):**

```
Background: #1a1a1a
Border: 1px solid #2a2a2a
Border-radius: 16px
Padding: 24px
Shadow: 0 2px 8px rgba(0, 0, 0, 0.3)

Hover:
  Border: #6731b7
  Transform: translateY(-2px)
  Shadow: 0 4px 16px rgba(0, 0, 0, 0.4)
```

**Elevated Card (Dark):**

```
Background: #222222
Border: 1px solid #3a3a3a
Border-radius: 20px
Padding: 28px
Shadow: 0 4px 16px rgba(0, 0, 0, 0.4)
```

**Standard Card (Light):**

```
Background: #ffffff
Border: 1px solid #e8ebe6
Shadow: 0 2px 8px rgba(0, 0, 0, 0.1)

Hover:
  Border: #5a7a5f
  Shadow: 0 4px 16px rgba(0, 0, 0, 0.12)
```

---

### 5. Timetable Grid

**Grid Container (Dark):**

```
Background: #1a1a1a
Border: 1px solid #2a2a2a
Border-radius: 12px
Overflow: hidden
Shadow: 0 2px 8px rgba(0, 0, 0, 0.3)
```

**Header Row (Dark):**

```
Background: #222222
Border-bottom: 2px solid #3a3a3a
Height: 56px
Text: Comfortaa Semibold 15px #ffffff
Alignment: center
```

**Time Column (Dark):**

```
Width: 80px
Background: #141414
Border-right: 2px solid #2a2a2a
Text: Manrope Medium 13px #808080
Alignment: center
```

**Time Slot Cell (Dark):**

```
Min-height: 80px
Border: 1px solid rgba(255, 255, 255, 0.05)
Background: transparent

Hover: background rgba(255, 255, 255, 0.03)
```

**Class Block (Dark):**

```
Background: #6731b7
Border-radius: 8px
Padding: 12px
Cursor: grab
Shadow: 0 2px 8px rgba(103, 49, 183, 0.4)

Content:
  Course Code: Comfortaa Bold 14px #ffffff
  Room: Manrope Regular 12px rgba(255,255,255,0.8)
  Time: Manrope Regular 11px rgba(255,255,255,0.7)

Hover: scale(1.02) + shadow 0 4px 16px
Dragging: opacity 0.8, cursor grabbing
```

**Conflict State (Dark):**

```
Border: 2px solid #f44336
Background: rgba(244, 67, 54, 0.15)
Animation: pulse 1s infinite
```

**Grid Container (Light):**

```
Background: #ffffff
Border: 1px solid #e8ebe6
```

**Header Row (Light):**

```
Background: #faf9f5
Border-bottom: 2px solid #e8ebe6
Text: #1f2d1f
```

**Time Column (Light):**

```
Background: #f5f4f0
Border-right: 2px solid #e8ebe6
Text: #8a9a8f
```

**Class Block (Light):**

```
Background: #5a7a5f
Text: #ffffff
Shadow: 0 2px 8px rgba(90, 122, 95, 0.3)
```

---

### 6. Modals

**Overlay (Dark):**

```
Background: rgba(10, 10, 10, 0.85)
Backdrop-filter: blur(8px)
```

**Modal Container (Dark):**

```
Background: #1a1a1a
Border: 1px solid #3a3a3a
Border-radius: 20px
Padding: 32px
Max-width: 600px
Shadow: 0 20px 60px rgba(0, 0, 0, 0.6)
Animation: scale(0.95 to 1) + fade 0.2s

Header:
  Font: Comfortaa Semibold 24px #ffffff
  Border-bottom: 1px solid #2a2a2a
  Padding-bottom: 16px
  Margin-bottom: 20px

Close Button (top-right):
  Size: 32px
  Icon: X 20px #c3c3c3
  Hover: #ffffff
```

**Modal (Light):**

```
Background: #ffffff
Border: 1px solid #e8ebe6
Shadow: 0 20px 60px rgba(0, 0, 0, 0.2)

Header text: #1f2d1f
Border-bottom: #e8ebe6
Close icon: #4a5a4f, hover #1f2d1f
```

---

### 7. Toast Notifications

**Toast (Dark):**

```
Min-width: 360px
Max-width: 480px
Background: #222222
Border: 1px solid #3a3a3a
Border-radius: 12px
Padding: 16px 20px
Shadow: 0 8px 32px rgba(0, 0, 0, 0.5)
Position: top-right 24px
Animation: slide-in-from-right 0.3s

Layout:
  Icon (20px) + Content + Close button (16px)

Title: Comfortaa Semibold 14px #ffffff
Message: Manrope Regular 13px #c3c3c3
Close: X icon #808080, hover #ffffff

Types:
  Success: CheckCircle #4caf50
  Error: AlertCircle #f44336
  Info: Info #2196f3
  Warning: AlertTriangle #ff9800
```

**Toast (Light):**

```
Background: #ffffff
Border: 1px solid #e8ebe6
Shadow: 0 8px 32px rgba(0, 0, 0, 0.15)

Title: #1f2d1f
Message: #4a5a4f
Close: #8a9a8f, hover #1f2d1f

Types:
  Success: #2d7a3e
  Error: #b44336
  Info: #2563a8
  Warning: #b8860b
```

---

### 8. Split-Screen Auth Pages

**Layout:**

```
Total: 1920px × 1080px
Split: 50% branding / 50% form
```

**Left Side (Dark):**

```
Background: #0a0a0a
Content (vertically centered):
  - CHRONOS logo (large)
  - Tagline: "Time, Organized"
  - Abstract timetable illustration
```

**Right Side (Dark):**

```
Background: #1a1a1a
Form container: max-width 480px, centered
Padding: 80px vertical
```

**Left Side (Light):**

```
Background: #faf9f5
```

**Right Side (Light):**

```
Background: #ffffff
```

---

## Page Layouts (11 Screens)

### 1. Landing Page

**Structure:**

- Fixed navigation (solid background)
- Hero section (full viewport)
- Feature cards (4 columns)
- Benefits section
- Footer

**Hero (Dark):**

```
Background: #0a0a0a
Heading: "Scheduling Made Effortless" (56px Comfortaa Bold #ffffff)
Subheading: 18px Manrope #c3c3c3
CTA: Primary button "Get Started"
```

**Feature Cards (3-4 per row):**

```
Card includes:
  - Icon (24px)
  - Title (20px Comfortaa Medium)
  - Description (14px Manrope)

No placeholder text - only real content
```

---

### 2. Login Page (Split Screen)

**Left (50%):** CHRONOS branding

**Right (50%):**

```
- "Welcome Back" (40px Comfortaa)
- Email input (Mail icon)
- Password input (Lock icon + Eye toggle)
- "Forgot Password?" link
- "Sign In" button (full width)
- "Don't have an account? Create Account"
```

---

### 3. Register Page (Split Screen)

**Left (50%):** CHRONOS branding

**Right (50%):**

```
- "Create Account" (40px Comfortaa)
- First Name + Last Name (2 columns)
- Email input
- Password input
- Role dropdown (Student, Lecturer, Admin)
- Department input
- "Create Account" button (full width)
- "Already have an account? Sign In"
```

---

### 4. Forgot Password (Split Screen)

**Left (50%):** CHRONOS branding

**Right (50%):**

```
Default state:
  - "Reset Password" (40px)
  - Email input
  - "Send Reset Link" button

Success state:
  - Checkmark icon (48px)
  - "Check Your Email" (24px)
  - Confirmation text
  - "Back to Login" link
```

---

### 5. Dashboard Page

**Layout:**

- Collapsible sidebar (280px/72px)
- Top bar (64px)
- Main content area

**Content:**

```
- "Welcome back, [Name]!" (40px)
- User info card:
    Avatar (48px circle)
    Name (20px)
    Email (14px)
    Role badge (pill)

- Stat cards (3 columns):
    Timetables: 12
    Sessions: 48
    Courses: 8

- Upcoming sessions list
```

---

### 6. Courses Management

**Layout:**

```
- Page heading "Courses" (32px)
- Action bar:
    Search input (left)
    Plus button + "Add Course" (right)

- Course cards (3 columns):
    Course code (20px Comfortaa Bold)
    Course name (16px)
    Department, Semester (14px)
    Edit icon button, Delete icon button (right)

Empty state:
  BookOpen icon 48px
  "No courses yet" 20px
  "Add Course" button
```

---

### 7. Rooms Management

**Layout:**

```
- Page heading "Rooms" (32px)
- Action bar:
    Search input (left)
    Plus button + "Add Room" (right)

- Room cards (3 columns):
    Room name (20px Comfortaa Bold)
    Building, Floor (14px)
    Capacity (14px)
    Equipment tags (pills)
    Edit icon, Delete icon (right)

Empty state:
  DoorOpen icon
  "No rooms yet"
  "Add Room" button
```

---

### 8. Timetable Generation

**Layout:**

```
- "Generate Timetable" heading (32px)
- Single column form (max-width 720px):
    1. Department dropdown
    2. Semester dropdown
    3. Course multi-select
    4. Lecturer availability
    5. Room constraints
    6. AI toggle switch
    7. "Generate" button (full width)

Right sidebar (desktop only):
  Selected: X courses
  Constraints summary
```

---

### 9. Timetable Grid View

**Layout:**

```
- Page heading + Department/Semester filters
- Export button (top-right, Download icon)

Grid:
  - Time column (80px) + 6 days (Mon-Sat)
  - Time slots: 08:00, 10:00, 12:00, 14:00, 16:00
  - Class blocks (draggable):
      Course code
      Room
      Time
  - Conflict blocks: red border + pulse
```

---

### 10. Conflict Modal

**Modal Content:**

```
- "Conflicts Detected" heading (24px)
- Conflict list:
    AlertCircle icon
    "CSC 301 overlaps with MTH 205"
    Affected: Monday 10:00-12:00

- "Auto-Resolve" button
- "Manual Edit" button
- "Cancel" button
```

---

### 11. Timetable List

**Layout:**

```
- "Timetables" heading (32px)
- Filters: Department, Semester, Status
- Cards (2-3 columns):
    Timetable name (20px)
    Department + Semester (14px)
    Status badge (Draft/Published)
    Last modified
    View, Edit, Delete icons
```

---

## Component Library

### Form Elements

- Text input (default, focus, error)
- Password input (Eye toggle)
- Dropdown (ChevronDown)
- Checkbox
- Radio button
- Toggle switch
- Multi-select
- Date picker
- Time picker

### Feedback

- Toasts (success, error, info, warning)
- Loading spinner (circular, primary color)
- Progress bar (3px height)
- Empty states
- Inline errors
- Skeleton loaders

### Icons (Lucide React)

```
Navigation: LayoutDashboard, BookOpen, DoorOpen, Calendar, Settings
Actions: Plus, Edit2, Trash2, Save, Download, Upload, Filter, Search
Status: CheckCircle, AlertCircle, Info, AlertTriangle, X
UI: ChevronLeft, ChevronRight, ChevronDown, Eye, EyeOff
User: User, LogOut, Bell, Mail, Lock
Timetable: Clock, Users, MapPin
```

---

## Spacing System

```
4px: Tight
8px: Small
12px: Default
16px: Medium
24px: Large
32px: XL
48px: 2XL
64px: 3XL
```

---

## Border Radius

```
4px: Tags, badges
8px: Buttons, inputs
12px: Grid, dropdowns
16px: Cards
20px: Elevated cards, modals
```

---

## Shadows

**Dark Mode:**

```
Cards: 0 2px 8px rgba(0, 0, 0, 0.3)
Hover: 0 4px 16px rgba(0, 0, 0, 0.4)
Dropdowns: 0 8px 32px rgba(0, 0, 0, 0.5)
Modals: 0 20px 60px rgba(0, 0, 0, 0.6)
Primary: 0 2px 8px rgba(103, 49, 183, 0.3)
```

**Light Mode:**

```
Cards: 0 2px 8px rgba(0, 0, 0, 0.1)
Hover: 0 4px 16px rgba(0, 0, 0, 0.12)
Dropdowns: 0 8px 32px rgba(0, 0, 0, 0.15)
Modals: 0 20px 60px rgba(0, 0, 0, 0.2)
Primary: 0 2px 8px rgba(90, 122, 95, 0.25)
```

---

## Responsive Breakpoints

```
Mobile: 0-640px
  - Sidebar: Hidden (hamburger)
  - Grid: Horizontal scroll
  - Cards: 1 column

Tablet: 641-1024px
  - Sidebar: 72px collapsed
  - Cards: 2 columns

Desktop: 1025px+
  - Sidebar: 280px expanded
  - Cards: 3 columns
```

---

## Animations

**Allowed:**

- Button hover: translateY(-1px) 0.2s
- Card hover: translateY(-2px) 0.3s
- Modal: scale(0.95 to 1) + fade 0.2s
- Toast: slide-in-right 0.3s
- Sidebar: width 0.3s

**Easing:** cubic-bezier(0.4, 0, 0.2, 1)

---

## Accessibility

- Contrast: 4.5:1 minimum
- Focus indicators: 2px ring
- Touch targets: 44×44px minimum
- ARIA labels on icon-only buttons
- Semantic HTML
- Screen reader support

---

## Export Requirements

### Deliverables

1. All 11 pages at 1920×1080
2. Component library (all states)
3. Mobile variants (375px)
4. Both dark and light modes
5. Style guide page

### File Organization

```
/Pages
  /01-Landing (dark + light)
  /02-Login (dark + light)
  /03-Register (dark + light)
  /04-Forgot-Password (dark + light)
  /05-Dashboard (dark + light)
  /06-Courses (dark + light)
  /07-Rooms (dark + light)
  /08-Timetable-Generation (dark + light)
  /09-Timetable-Grid (dark + light)
  /10-Conflict-Modal (dark + light)
  /11-Timetable-List (dark + light)

/Components
  /Buttons
  /Inputs
  /Cards
  /Navigation
  /Modals
  /Toasts
  /Icons

/Style-Guide
```

---

## Final Notes

1. Dark mode is primary—design it first
2. Light mode is fully supported—design it second
3. No gradients—solid colors only
4. No emojis—Lucide icons only
5. No border-left accent styling
6. Meaningful content only—no placeholder text
7. Icon-only buttons for Edit, Delete, Filter, Search
8. Logo text matches grid height (24px)
9. Split screens are 50/50
10. Timeless, professional, accessible
