# Doctor's Assistant Frontend

A beautiful, modern, and user-friendly React frontend for the Doctor's Assistant AI chatbot.

## 🚀 Features

- **Modern React 18** with TypeScript
- **Tailwind CSS** for stunning styling
- **Framer Motion** for smooth animations
- **Responsive Design** for all devices
- **Real-time Chat Interface** with AI integration
- **Doctor Management** with search and filtering
- **Appointment Booking** with step-by-step wizard
- **Beautiful UI Components** with glass effects and gradients

## 🛠️ Tech Stack

- **React 18** - Latest React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Elegant notifications

## 📦 Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (`from-primary-500 to-primary-600`)
- **Medical**: Green gradient (`from-medical-500 to-medical-600`)
- **Background**: Soft gradients (`from-slate-50 to-blue-50`)

### Components
- **Glass Effect**: `glass-effect` class for frosted glass look
- **Gradient Text**: `gradient-text` class for beautiful text gradients
- **Cards**: `card` class for consistent card styling
- **Buttons**: `btn-primary` and `btn-secondary` for consistent button styles

### Animations
- **Fade In**: Smooth opacity transitions
- **Slide Up**: Content slides up from bottom
- **Hover Effects**: Subtle scale and shadow changes
- **Loading States**: Skeleton loaders and spinners

## 📱 Pages

### 1. Dashboard (`/`)
- Hero section with call-to-action
- Feature highlights
- Statistics display
- Featured doctors
- Quick navigation

### 2. Chat Interface (`/chat`)
- Real-time messaging with AI
- Typing indicators
- Function call displays
- Quick action buttons
- Message history

### 3. Doctor List (`/doctors`)
- Search and filter functionality
- Specialty-based filtering
- Doctor cards with information
- Direct booking links

### 4. Appointment Booking (`/book`)
- Step-by-step booking wizard
- Doctor selection
- Form validation
- Time slot selection
- Confirmation page

## 🔧 API Integration

The frontend integrates with the FastAPI backend through:

- **Chat API**: Real-time messaging with OpenAI
- **Doctor API**: CRUD operations for doctors
- **Appointment API**: Booking and management
- **Availability API**: Check doctor availability

## 🎯 Key Features

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interactions

### Accessibility
- Keyboard navigation support
- Screen reader friendly
- High contrast ratios
- Focus indicators

### Performance
- Code splitting with React.lazy
- Optimized images and assets
- Efficient re-renders
- Fast loading times

### User Experience
- Intuitive navigation
- Clear visual hierarchy
- Smooth animations
- Helpful error messages

## 🚀 Deployment

### Development
```bash
npm run dev
```
Runs on http://localhost:3000

### Production Build
```bash
npm run build
npm run preview
```

### Environment Variables
Create a `.env` file:
```
VITE_API_URL=http://localhost:8000
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx
│   │   ├── Dashboard.tsx
│   │   ├── ChatInterface.tsx
│   │   ├── DoctorList.tsx
│   │   └── AppointmentBooking.tsx
│   ├── services/            # API services
│   │   └── api.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # App entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🎨 Customization

### Adding New Components
1. Create component in `src/components/`
2. Export from component file
3. Import and use in App.tsx

### Styling
- Use Tailwind classes for styling
- Add custom classes in `index.css`
- Use Framer Motion for animations

### API Integration
- Add new API calls in `src/services/api.ts`
- Update TypeScript types in `src/types/index.ts`
- Handle loading and error states

## 🔍 Development Tips

1. **Hot Reload**: Changes reflect immediately
2. **TypeScript**: Catch errors at compile time
3. **Tailwind**: Use IntelliSense for class names
4. **Framer Motion**: Animate with ease
5. **React DevTools**: Debug components easily

## 📞 Support

For issues or questions:
- Check the console for errors
- Verify API endpoints are working
- Ensure all dependencies are installed
- Check TypeScript types are correct

---

Built with ❤️ using modern web technologies for the best user experience.
