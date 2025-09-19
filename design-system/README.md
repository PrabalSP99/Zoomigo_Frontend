# Design System Documentation

## 🎨 **Visual Language & Mood Boards**

### **Primary Style: Stripe-like Clean Design**
- **Clean & Minimal**: Generous whitespace, clear hierarchy
- **Subtle Motion**: Smooth transitions, hover effects
- **Professional**: Trustworthy, reliable appearance
- **Accessible**: High contrast, readable typography

### **Secondary Style: Airbnb-like Warmth**
- **Warm Imagery**: High-quality vehicle photos
- **Discovery Focus**: Easy exploration of options
- **Community Feel**: Reviews, ratings, social proof
- **Approachable**: Friendly, welcoming interface

### **Tertiary Style: Modern E-commerce**
- **Product Showcase**: Detailed vehicle information
- **Conversion Focus**: Clear CTAs, pricing display
- **Trust Signals**: Security badges, guarantees
- **Mobile-First**: Responsive, touch-friendly

## 🎯 **Design Tokens**

### **Color Palette**
```typescript
// Primary Colors (Blue)
primary: {
  50: '#eff6ff',   // Lightest
  500: '#3b82f6',  // Main brand
  900: '#1e3a8a',  // Darkest
}

// Semantic Colors
success: { 500: '#22c55e' }  // Green
warning: { 500: '#f59e0b' }  // Yellow
error: { 500: '#ef4444' }    // Red
```

### **Typography Scale**
```typescript
fontSize: {
  xs: '0.75rem',    // 12px - Captions
  sm: '0.875rem',   // 14px - Small text
  base: '1rem',     // 16px - Body text
  lg: '1.125rem',   // 18px - Large text
  xl: '1.25rem',    // 20px - Headings
  '2xl': '1.5rem',  // 24px - Subheadings
  '3xl': '1.875rem', // 30px - Main headings
}
```

### **Spacing Scale**
```typescript
spacing: {
  1: '0.25rem',   // 4px - Micro spacing
  4: '1rem',      // 16px - Base spacing
  6: '1.5rem',    // 24px - Section spacing
  8: '2rem',      // 32px - Large spacing
  12: '3rem',     // 48px - Page spacing
}
```

### **Border Radius**
```typescript
borderRadius: {
  sm: '0.125rem',  // 2px - Small elements
  base: '0.25rem', // 4px - Default
  lg: '0.5rem',    // 8px - Cards
  xl: '0.75rem',   // 12px - Large elements
  full: '9999px',  // Pills
}
```

## 🧩 **Atomic Components**

### **Button Component**
```typescript
<Button 
  variant="primary" | "secondary" | "outline" | "ghost" | "danger"
  size="sm" | "md" | "lg"
  loading={boolean}
  disabled={boolean}
  fullWidth={boolean}
>
  Button Text
</Button>
```

### **Input Component**
```typescript
<Input
  type="text" | "email" | "password" | "number"
  label="Field Label"
  error={boolean}
  errorMessage="Error message"
  required={boolean}
  size="sm" | "md" | "lg"
/>
```

### **Card Component**
```typescript
<Card variant="default" | "elevated" | "outlined" | "flat">
  <CardHeader>Header Content</CardHeader>
  <CardBody>Main Content</CardBody>
  <CardFooter>Footer Content</CardFooter>
</Card>
```

### **Modal Component**
```typescript
<Modal
  isOpen={boolean}
  onClose={() => void}
  title="Modal Title"
  size="sm" | "md" | "lg" | "xl" | "full"
>
  Modal Content
</Modal>
```

### **Rating Component**
```typescript
<Rating
  value={number}
  max={number}
  size="sm" | "md" | "lg"
  readonly={boolean}
  showValue={boolean}
  onChange={(value) => void}
/>
```

### **Image Carousel Component**
```typescript
<ImageCarousel
  images={Array<{url: string, altText: string}>}
  autoPlay={boolean}
  interval={number}
  showDots={boolean}
  showArrows={boolean}
  height="400px"
/>
```

## 📱 **Responsive Layout Grid**

### **Breakpoints**
```typescript
breakpoints: {
  mobile: '600px',    // ≤600px
  tablet: '1024px',   // 601–1024px
  desktop: '1025px',  // ≥1025px
}
```

### **Grid System**
```css
/* Mobile First */
.grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

/* Tablet */
@media (min-width: 601px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

/* Desktop */
@media (min-width: 1025px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}
```

### **Container Widths**
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 768px) {
  .container {
    padding: 0 2rem;
  }
}
```

## 🎭 **Component States**

### **Interactive States**
- **Default**: Normal appearance
- **Hover**: Subtle color/scale changes
- **Active**: Pressed state
- **Focus**: Keyboard navigation
- **Disabled**: Grayed out, non-interactive

### **Loading States**
- **Skeleton**: Placeholder content
- **Spinner**: Loading indicator
- **Progress**: Step-by-step progress

### **Error States**
- **Validation**: Field-level errors
- **Network**: Connection errors
- **Empty**: No data available

## 🎨 **Animation Guidelines**

### **Duration**
```typescript
duration: {
  fast: '150ms',   // Micro interactions
  normal: '250ms', // Standard transitions
  slow: '350ms',   // Complex animations
}
```

### **Easing**
```typescript
easing: {
  ease: 'cubic-bezier(0.4, 0, 0.2, 1)',     // Standard
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',     // Enter animations
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',    // Exit animations
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)' // Complex transitions
}
```

## 📋 **Usage Guidelines**

### **Color Usage**
- **Primary**: Main actions, brand elements
- **Secondary**: Supporting elements, backgrounds
- **Success**: Positive feedback, confirmations
- **Warning**: Cautionary messages, alerts
- **Error**: Error states, destructive actions

### **Typography Hierarchy**
1. **H1**: Page titles (3xl)
2. **H2**: Section headings (2xl)
3. **H3**: Subsection headings (xl)
4. **Body**: Main content (base)
5. **Caption**: Supporting text (sm)

### **Spacing Rules**
- **Consistent**: Use spacing scale consistently
- **Proportional**: Larger elements get more space
- **Grouped**: Related elements grouped together
- **Breathing Room**: Generous whitespace

## 🔧 **Implementation Notes**

### **Accessibility**
- **Keyboard Navigation**: All interactive elements
- **Screen Readers**: Proper ARIA labels
- **Color Contrast**: WCAG AA compliance
- **Focus Indicators**: Clear focus states

### **Performance**
- **Lazy Loading**: Images and heavy components
- **Code Splitting**: Component-level splitting
- **Optimized Assets**: Compressed images
- **Caching**: Static assets cached

### **Browser Support**
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile**: iOS Safari, Chrome Mobile
- **Fallbacks**: Graceful degradation
