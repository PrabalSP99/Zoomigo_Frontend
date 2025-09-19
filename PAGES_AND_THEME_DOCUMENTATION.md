# BadhoSa Rental App - Pages & Color Theme Documentation

## 📄 All Pages in Client Directory (Excluding Home Screen)

### 1. **Authentication Page** (`/auth`)
- **File**: `app/auth/page.tsx`
- **Purpose**: User login and signup functionality
- **Features**: 
  - Two-column layout with animated transitions
  - Stripe-style car animation on left side
  - Typewriter text effects
  - Capsule button design for Login/Signup toggle
  - Password visibility toggles
  - Responsive design

### 2. **Search Page** (`/search`)
- **File**: `app/search/page.tsx`
- **Purpose**: Vehicle search and filtering
- **Features**:
  - Advanced filtering sidebar
  - Grid/List/Map view modes
  - Vehicle cards with booking functionality
  - Responsive layout
  - Search results display

### 3. **Vehicles Page** (`/vehicles`)
- **File**: `app/vehicles/page.tsx`
- **Purpose**: Browse all available vehicles
- **Features**:
  - Grid/List/Table view modes
  - Advanced filtering system
  - Vehicle cards with detailed information
  - Sorting options
  - Pagination support

### 4. **Vehicle Detail Page** (`/vehicles/[id]`)
- **File**: `app/vehicles/[id]/page.tsx`
- **Purpose**: Detailed view of individual vehicles
- **Features**:
  - Image carousel
  - Detailed specifications
  - Pricing information
  - Booking functionality
  - Reviews and ratings

### 5. **Booking Page** (`/booking`)
- **File**: `app/booking/page.tsx`
- **Purpose**: Vehicle booking process
- **Features**:
  - Multi-step booking process
  - Date and time selection
  - Payment integration
  - Progress indicators
  - Booking confirmation

### 6. **Bookings Page** (`/bookings`)
- **File**: `app/bookings/page.tsx`
- **Purpose**: User's booking management
- **Features**:
  - Upcoming and past bookings
  - Booking status tracking
  - Modify/Cancel functionality
  - Booking history
  - Tab-based navigation

### 7. **Profile Page** (`/profile`)
- **File**: `app/profile/page.tsx`
- **Purpose**: User profile management
- **Features**:
  - Personal information editing
  - Driver's license information
  - Security settings
  - Account actions
  - Profile avatar with gradient background

### 8. **Dashboard Page** (`/dashboard`)
- **File**: `app/dashboard/page.tsx`
- **Purpose**: User dashboard overview
- **Features**:
  - Quick stats cards
  - Recent bookings
  - Quick actions
  - User welcome section
  - Activity overview

---

## 🎨 Color Theme Documentation

### **Primary Color Scheme: Indigo-900**

#### **Background Colors**
- **Main Background**: `bg-gradient-to-t from-gray-100 to-gray-50`
- **Card Backgrounds**: `bg-white`
- **Loading States**: `bg-gradient-to-t from-gray-100 to-gray-50`

#### **Primary Buttons**
```css
/* Gradient Primary Buttons */
bg-gradient-to-r from-indigo-900 to-indigo-700
hover:from-indigo-800 hover:to-indigo-600
text-white font-semibold py-3 px-4 rounded-lg
transition-all duration-200 ease-in-out
hover:scale-105 hover:shadow-lg
```

#### **Secondary/Outline Buttons**
```css
/* Outline Buttons */
border-indigo-300 text-indigo-600
hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-700
transition-all duration-200
```

#### **Navigation Elements**
```css
/* Navigation Hover Effects */
text-gray-600 hover:text-white hover:bg-indigo-900
transition-all duration-200 font-medium px-3 py-2 rounded-full
```

#### **Form Elements**
```css
/* Input Focus States */
focus:ring-indigo-500 focus:border-indigo-500
```

#### **Special Elements**

##### **Profile Avatar**
```css
/* Gradient Avatar Background */
bg-gradient-to-br from-indigo-900 to-indigo-700
text-white
```

##### **Security Cards**
```css
/* Security Section Backgrounds */
bg-gradient-to-r from-indigo-50 to-indigo-100
border border-indigo-200
text-indigo-900 (headings)
text-indigo-700 (descriptions)
```

##### **Logout Button**
```css
/* Logout Button Special Styling */
text-gray-700 hover:text-white hover:bg-red-800
transition-all duration-200 font-medium px-3 py-2 rounded-full
```

#### **View Mode Toggles**
```css
/* Active State */
bg-indigo-900 text-white

/* Inactive State */
text-gray-600 hover:text-indigo-600
```

#### **Tab Navigation**
```css
/* Active Tab */
bg-indigo-900 text-white

/* Inactive Tab */
text-gray-600 hover:text-indigo-600
```

#### **Progress Steps**
```css
/* Active Step */
bg-indigo-900 text-white

/* Completed Step */
bg-green-600 text-white

/* Inactive Step */
bg-gray-300 text-gray-600
```

### **Color Palette Summary**

| Element Type | Default | Hover/Active | Focus |
|-------------|---------|--------------|-------|
| Primary Buttons | `indigo-900` gradient | `indigo-800` gradient | - |
| Secondary Buttons | `indigo-300` border, `indigo-600` text | `indigo-50` bg, `indigo-700` text | - |
| Navigation Links | `gray-600` | `white` text, `indigo-900` bg | - |
| Form Inputs | `gray-300` border | - | `indigo-500` ring/border |
| Logout Button | `gray-700` | `white` text, `red-800` bg | - |
| Backgrounds | `gray-100` to `gray-50` gradient | - | - |
| Cards | `white` | - | - |

### **Animation & Transitions**
- **Duration**: `duration-200` (200ms)
- **Easing**: `ease-in-out`
- **Effects**: `hover:scale-105`, `hover:shadow-lg`
- **Shape**: `rounded-full` for capsules, `rounded-lg` for buttons

### **Responsive Design**
- **Mobile**: `hidden sm:block` for navigation items
- **Tablet**: `md:` breakpoints for grid layouts
- **Desktop**: `lg:` breakpoints for full layouts
- **Spacing**: Responsive padding and margins throughout

---

## 🚀 Implementation Notes

### **Consistency Across Pages**
- All pages use the same gradient background
- Consistent button styling and hover effects
- Uniform navigation behavior
- Standardized form input styling
- Cohesive color scheme throughout

### **Accessibility**
- Proper contrast ratios maintained
- Focus states clearly visible
- Tooltips for icon-only buttons
- Semantic HTML structure

### **Performance**
- CSS transitions optimized for smooth animations
- Gradient backgrounds use efficient CSS
- Responsive images and layouts
- Minimal JavaScript for interactions

This documentation provides a comprehensive overview of all pages and the consistent indigo-900 color theme implemented throughout the BadhoSa Rental App.
