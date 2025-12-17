# Chronos Timetable Management System - Style Guide

## Branding

### Logo & Name

- **Product Name:** Chronos
- **Logo:** 5×3 grid with indigo (#6731b7), silver (#c3c3c3), and white (#ffffff) blocks
- **Logo Font:** Dongle Bold (24px - matches grid height)
- **Tagline:** "Time, Organized"

---

## Color Palette

### Dark Mode (Primary)

**Backgrounds:**

- Main canvas: `#0a0a0a` - Pure black
- Cards/panels: `#1a1a1a` - Dark surface
- Elevated surfaces: `#222222` - Hover states, dropdowns

**Accents:**

- Primary CTA: `#6731b7` - Indigo bloom
- Secondary: `#523e93` - Indigo velvet
- Light accent: `#9975cd` - Indigo light

**Text:**

- Primary: `#ffffff` - Pure white
- Secondary: `#c3c3c3` - Silver
- Muted: `#808080` - Medium grey

**Borders:**

- Subtle: `#2a2a2a`
- Prominent: `#3a3a3a`

**Semantic:**

- Success: `#4caf50` - Bright green
- Warning: `#ff9800` - Amber orange
- Error: `#f44336` - Bright red
- Info: `#2196f3` - Bright blue

### Light Mode

**Backgrounds:**

- Main canvas: `#faf9f5` - Warm off-white
- Cards/panels: `#ffffff` - Pure white
- Elevated surfaces: `#e8ebe6` - Light sage grey

**Accents:**

- Primary CTA: `#5a7a5f` - Muted sage green
- Secondary: `#7591a3` - Slate blue

**Text:**

- Primary: `#1f2d1f` - Deep forest
- Secondary: `#4a5a4f` - Medium grey-green
- Muted: `#8a9a8f` - Light grey-green

**Semantic:**

- Success: `#2d7a3e` - Forest green
- Warning: `#b8860b` - Dark goldenrod
- Error: `#b44336` - Deep red
- Info: `#2563a8` - Deep blue

---

## Typography

**Fonts:**

- Logo: `'Dongle', sans-serif` (Bold, 24px)
- Headings: `'Comfortaa', sans-serif`
- Body/UI: `'Manrope', sans-serif`

**Scale (Dark Mode):**

```
Hero: 56px / Comfortaa Bold / #ffffff
H1: 40px / Comfortaa Semibold / #ffffff
H2: 32px / Comfortaa Semibold / #ffffff
H3: 24px / Comfortaa Medium / #ffffff
H4: 20px / Comfortaa Medium / #ffffff
Body Large: 18px / Manrope Regular / #c3c3c3
Body: 16px / Manrope Regular / #c3c3c3
Small: 14px / Manrope Regular / #c3c3c3
Caption: 12px / Manrope Medium / #808080
```

**Scale (Light Mode):**

```
Hero: 56px / Comfortaa Bold / #1f2d1f
H1: 40px / Comfortaa Semibold / #1f2d1f
H2: 32px / Comfortaa Semibold / #1f2d1f
H3: 24px / Comfortaa Medium / #1f2d1f
H4: 20px / Comfortaa Medium / #1f2d1f
Body Large: 18px / Manrope Regular / #4a5a4f
Body: 16px / Manrope Regular / #4a5a4f
Small: 14px / Manrope Regular / #4a5a4f
Caption: 12px / Manrope Medium / #8a9a8f
```

---

## Components

### Logo Component

**Dark Mode:**

```jsx
<div className="flex items-center gap-3">
  <div className="grid grid-cols-5 gap-0.5 w-10 h-6">
    {/* Row 1 */}
    <div className="bg-[#6731b7] rounded-sm"></div>
    <div className="bg-[#6731b7] rounded-sm"></div>
    <div className="bg-[#6731b7] rounded-sm"></div>
    <div className="bg-[#c3c3c3] rounded-sm"></div>
    <div className="bg-white rounded-sm"></div>
    {/* Row 2 */}
    <div className="bg-[#6731b7] rounded-sm"></div>
    <div className="bg-white rounded-sm"></div>
    <div className="bg-[#6731b7] rounded-sm"></div>
    <div className="bg-[#c3c3c3] rounded-sm"></div>
    <div className="bg-white rounded-sm"></div>
    {/* Row 3 */}
    <div className="bg-white rounded-sm"></div>
    <div className="bg-[#6731b7] rounded-sm"></div>
    <div className="bg-[#c3c3c3] rounded-sm"></div>
    <div className="bg-[#6731b7] rounded-sm"></div>
    <div className="bg-white rounded-sm"></div>
  </div>
  <span
    className="text-2xl font-bold"
    style="font-family: 'Dongle', sans-serif;"
  >
    CHRONOS
  </span>
</div>
```

**Light Mode:**

```jsx
<div className="flex items-center gap-3">
  <div className="grid grid-cols-5 gap-0.5 w-10 h-6">
    {/* Row 1 */}
    <div className="bg-[#5a7a5f] rounded-sm"></div>
    <div className="bg-[#5a7a5f] rounded-sm"></div>
    <div className="bg-[#5a7a5f] rounded-sm"></div>
    <div className="bg-[#7591a3] rounded-sm"></div>
    <div className="bg-[#1f2d1f] rounded-sm"></div>
    {/* Row 2 */}
    <div className="bg-[#5a7a5f] rounded-sm"></div>
    <div className="bg-[#1f2d1f] rounded-sm"></div>
    <div className="bg-[#5a7a5f] rounded-sm"></div>
    <div className="bg-[#7591a3] rounded-sm"></div>
    <div className="bg-[#1f2d1f] rounded-sm"></div>
    {/* Row 3 */}
    <div className="bg-[#1f2d1f] rounded-sm"></div>
    <div className="bg-[#5a7a5f] rounded-sm"></div>
    <div className="bg-[#7591a3] rounded-sm"></div>
    <div className="bg-[#5a7a5f] rounded-sm"></div>
    <div className="bg-[#1f2d1f] rounded-sm"></div>
  </div>
  <span
    className="text-2xl font-bold text-[#1f2d1f]"
    style="font-family: 'Dongle', sans-serif;"
  >
    CHRONOS
  </span>
</div>
```

### Buttons

**Primary (Dark):**

```jsx
className="px-6 py-3 bg-[#6731b7] hover:bg-[#523e93] text-white
           font-semibold rounded-lg shadow-lg transition-all duration-200"
```

**Primary (Light):**

```jsx
className="px-6 py-3 bg-[#5a7a5f] hover:bg-[#4a6a50] text-white
           font-semibold rounded-lg shadow-lg transition-all duration-200"
```

**Secondary (Dark):**

```jsx
className="px-6 py-3 border border-[#3a3a3a] text-[#c3c3c3]
           hover:bg-white/5 rounded-lg transition-all duration-200"
```

**Secondary (Light):**

```jsx
className="px-6 py-3 border border-[#e8ebe6] text-[#4a5a4f]
           hover:bg-black/5 rounded-lg transition-all duration-200"
```

**Icon Only (Dark):**

```jsx
className="p-2.5 text-[#c3c3c3] hover:bg-white/10 rounded-lg
           transition-all duration-200"
```

**Icon Only (Light):**

```jsx
className="p-2.5 text-[#4a5a4f] hover:bg-black/5 rounded-lg
           transition-all duration-200"
```

### Input Fields

**Dark Mode:**

```jsx
className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a]
           rounded-lg text-white placeholder:text-[#808080]
           focus:border-[#6731b7] focus:ring-2 focus:ring-[#6731b7]/20
           transition-all outline-none"
```

**Light Mode:**

```jsx
className="w-full px-4 py-3 bg-white border border-[#e8ebe6]
           rounded-lg text-[#1f2d1f] placeholder:text-[#8a9a8f]
           focus:border-[#5a7a5f] focus:ring-2 focus:ring-[#5a7a5f]/20
           transition-all outline-none"
```

### Cards

**Dark Mode:**

```jsx
className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6
           shadow-lg hover:border-[#6731b7] hover:-translate-y-0.5
           transition-all duration-300"
```

**Light Mode:**

```jsx
className="bg-white border border-[#e8ebe6] rounded-2xl p-6
           shadow-lg hover:border-[#5a7a5f] hover:-translate-y-0.5
           transition-all duration-300"
```

### Navigation

**Sidebar (Dark):**

```jsx
<aside
  className={`${collapsed ? "w-18" : "w-72"} h-screen bg-[#0a0a0a] 
                    border-r border-[#2a2a2a] transition-all duration-300`}
>
  <button
    className="absolute -right-3 top-6 p-1.5 bg-[#1a1a1a] 
                     border border-[#2a2a2a] rounded-full"
  >
    <ChevronLeft
      className={`w-4 h-4 text-[#c3c3c3] transition-transform 
                            ${collapsed ? "rotate-180" : ""}`}
    />
  </button>
</aside>
```

**Sidebar Item (Dark - Active):**

```jsx
className="px-4 py-3 rounded-lg bg-[#6731b7]/15 text-[#9975cd]
           border-l-2 border-[#6731b7]"
```

**Sidebar (Light):**

```jsx
<aside
  className={`${collapsed ? "w-18" : "w-72"} h-screen bg-[#faf9f5] 
                    border-r border-[#e8ebe6] transition-all duration-300`}
>
  <button
    className="absolute -right-3 top-6 p-1.5 bg-white 
                     border border-[#e8ebe6] rounded-full"
  >
    <ChevronLeft
      className={`w-4 h-4 text-[#4a5a4f] transition-transform 
                            ${collapsed ? "rotate-180" : ""}`}
    />
  </button>
</aside>
```

**Sidebar Item (Light - Active):**

```jsx
className="px-4 py-3 rounded-lg bg-[#5a7a5f]/10 text-[#5a7a5f]
           border-l-2 border-[#5a7a5f]"
```

### Timetable Grid

**Class Block (Dark):**

```jsx
className="bg-[#6731b7] rounded-lg p-3 cursor-grab shadow-lg
           hover:shadow-xl transition-shadow"
```

**Class Block (Light):**

```jsx
className="bg-[#5a7a5f] rounded-lg p-3 cursor-grab shadow-lg
           hover:shadow-xl transition-shadow"
```

**Conflict State (Dark):**

```jsx
className = "border-2 border-[#f44336] bg-[#f44336]/15 animate-pulse";
```

**Conflict State (Light):**

```jsx
className = "border-2 border-[#b44336] bg-[#b44336]/15 animate-pulse";
```

### Modals

**Overlay (Dark):**

```jsx
className = "fixed inset-0 bg-black/85 backdrop-blur-lg z-50";
```

**Modal Container (Dark):**

```jsx
className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-2xl p-8
           max-w-2xl shadow-2xl"
```

**Overlay (Light):**

```jsx
className = "fixed inset-0 bg-black/50 backdrop-blur-lg z-50";
```

**Modal Container (Light):**

```jsx
className="bg-white border border-[#e8ebe6] rounded-2xl p-8
           max-w-2xl shadow-2xl"
```

### Toast Notifications

**Dark Mode:**

```jsx
<div
  className="min-w-[360px] bg-[#222222] border border-[#3a3a3a] 
                rounded-xl p-4 shadow-2xl flex items-start gap-3"
>
  <CheckCircle className="w-5 h-5 text-[#4caf50]" />
  <div className="flex-1">
    <h4 className="text-sm font-semibold text-white">Success</h4>
    <p className="text-xs text-[#c3c3c3]">Action completed</p>
  </div>
  <button className="text-[#808080] hover:text-white">
    <X className="w-4 h-4" />
  </button>
</div>
```

**Light Mode:**

```jsx
<div
  className="min-w-[360px] bg-white border border-[#e8ebe6] 
                rounded-xl p-4 shadow-2xl flex items-start gap-3"
>
  <CheckCircle className="w-5 h-5 text-[#2d7a3e]" />
  <div className="flex-1">
    <h4 className="text-sm font-semibold text-[#1f2d1f]">Success</h4>
    <p className="text-xs text-[#4a5a4f]">Action completed</p>
  </div>
  <button className="text-[#8a9a8f] hover:text-[#1f2d1f]">
    <X className="w-4 h-4" />
  </button>
</div>
```

---

## Spacing Scale

```
4px  (gap-1, p-1)   - Tight spacing
8px  (gap-2, p-2)   - Small spacing
12px (gap-3, p-3)   - Default spacing
16px (gap-4, p-4)   - Medium spacing
24px (gap-6, p-6)   - Large spacing
32px (gap-8, p-8)   - XL spacing
48px (gap-12, p-12) - 2XL spacing
64px (gap-16, p-16) - 3XL spacing
```

---

## Shadows

**Dark Mode:**

```
Cards: 0 2px 8px rgba(0, 0, 0, 0.3)
Hover: 0 4px 16px rgba(0, 0, 0, 0.4)
Dropdowns: 0 8px 32px rgba(0, 0, 0, 0.5)
Modals: 0 20px 60px rgba(0, 0, 0, 0.6)
Primary Buttons: 0 2px 8px rgba(103, 49, 183, 0.3)
```

**Light Mode:**

```
Cards: 0 2px 8px rgba(0, 0, 0, 0.1)
Hover: 0 4px 16px rgba(0, 0, 0, 0.12)
Dropdowns: 0 8px 32px rgba(0, 0, 0, 0.15)
Modals: 0 20px 60px rgba(0, 0, 0, 0.2)
Primary Buttons: 0 2px 8px rgba(90, 122, 95, 0.25)
```

---

## Animations

**Allowed Only:**

- Hover transitions: `transition-all duration-200`
- Modal entry: `animate-in fade-in zoom-in-95 duration-200`
- Toast slide: `animate-in slide-in-from-right fade-in duration-300`
- Sidebar toggle: `transition-all duration-300`

**Easing:** `cubic-bezier(0.4, 0, 0.2, 1)`

---

## Responsive Breakpoints

```
sm: 640px   - Mobile
md: 768px   - Tablet
lg: 1024px  - Desktop
xl: 1280px  - Large Desktop
```

**Sidebar Behavior:**

- Mobile: Hidden (hamburger menu)
- Tablet: 72px collapsed
- Desktop: 280px expanded

---

## Icons (Lucide React)

- Primary actions: 24px
- Standard: 20px
- Small: 16px
- Color: Inherit from parent
- Always include `aria-label` for icon-only buttons

**Common Icons:**

- Navigation: LayoutDashboard, BookOpen, DoorOpen, Calendar, Settings
- Actions: Plus, Edit2, Trash2, Save, Download, Filter, Search
- Status: CheckCircle, AlertCircle, Info, AlertTriangle, X
- UI: ChevronLeft, ChevronRight, ChevronDown, Eye, EyeOff
- User: User, LogOut, Bell, Mail, Lock

---

## Accessibility

- Min contrast: 4.5:1
- Focus ring: `focus:ring-2 focus:ring-[accent]/20`
- Touch targets: Min 44×44px
- ARIA labels: Required for icon-only buttons
- Screen reader support: Semantic HTML

---

## State Indicators

**Loading (Dark):**

```jsx
<div className="h-1 w-full bg-[#2a2a2a] rounded-full overflow-hidden">
  <div className="h-full bg-[#6731b7] animate-pulse w-1/2" />
</div>
```

**Empty State (Dark):**

```jsx
<div className="flex flex-col items-center justify-center py-16">
  <BookOpen className="w-12 h-12 text-[#808080] mb-4" />
  <h3 className="text-xl font-semibold text-white mb-2">No courses yet</h3>
  <button className="px-6 py-3 bg-[#6731b7] text-white rounded-lg">
    Add Course
  </button>
</div>
```

**Error Inline (Dark):**

```jsx
<div className="rounded-lg p-4 bg-[#f44336]/10 border border-[#f44336]">
  <div className="flex items-start gap-3">
    <AlertCircle className="w-5 h-5 text-[#f44336]" />
    <p className="text-sm text-[#f44336]">Invalid email address</p>
  </div>
</div>
```

---

**Full Design Document:** See `UI-DESIGN-FULL.md` for complete page layouts and component specifications.
