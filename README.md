# OralScan AI - Expo Mobile App

A modern React Native mobile application built with Expo for AI-powered oral health analysis using smartphone cameras.

## 🚀 Features

- **AI-Powered Analysis**: Advanced oral health scanning using smartphone camera
- **Multi-Language Support**: Available in 8 languages (EN, HI, ES, FR, DE, AR, ZH, JA)
- **Real-time Camera Integration**: Live camera feed with positioning guidance
- **Progress Tracking**: Dashboard with comprehensive analytics and progress monitoring
- **Secure Authentication**: Supabase-powered user authentication with secure storage
- **Modern UI/UX**: TailwindCSS styling with smooth animations and haptic feedback
- **Cross-Platform**: Works on both iOS and Android devices

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **Styling**: TailwindCSS with NativeWind
- **Authentication**: Supabase
- **Database**: Supabase PostgreSQL
- **Animations**: React Native Animatable
- **Camera**: Expo Camera
- **State Management**: React Context API
- **Storage**: Expo SecureStore

## 📱 Screens

1. **Authentication Screen**: Sign in, sign up, and password reset
2. **Home Tab**: Dashboard overview with quick actions
3. **Scan Tab**: Camera interface with AI analysis
4. **Dashboard Tab**: Progress tracking and analytics
5. **Profile Tab**: User settings and preferences
6. **Results Screen**: Detailed analysis results display

## 🔧 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd OralScan_expo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   - For iOS: `npm run ios`
   - For Android: `npm run android`
   - For Web: `npm run web`

## 🔐 Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Set up authentication with email/password
3. Configure the following tables:
   - `profiles` - User profile information
   - `scans` - Scan history and results
   - `goals` - User health goals
   - `achievements` - User achievements

4. Enable Row Level Security (RLS) on all tables
5. Set up authentication policies for secure data access

## 📁 Project Structure

```
OralScan_expo/
├── app/
│   ├── (tabs)/              # Tab navigation screens
│   │   ├── index.tsx        # Home tab
│   │   ├── scan.tsx         # Scan tab
│   │   ├── dashboard.tsx    # Dashboard tab
│   │   └── profile.tsx      # Profile tab
│   ├── components/          # Reusable components
│   │   ├── AnimatedCard.tsx
│   │   ├── GradientButton.tsx
│   │   └── LoadingSpinner.tsx
│   ├── context/             # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── LanguageContext.tsx
│   ├── auth.tsx             # Authentication screen
│   ├── results.tsx          # Results screen
│   ├── index.tsx            # App entry point
│   └── _layout.tsx          # Root layout
├── assets/                  # Static assets
├── babel.config.js          # Babel configuration
├── tailwind.config.js       # TailwindCSS configuration
├── app.json                 # Expo configuration
└── package.json             # Dependencies
```

## 🎨 Styling

The app uses TailwindCSS with NativeWind for consistent, utility-first styling:

- **Theme Support**: Automatic dark/light mode switching
- **Responsive Design**: Mobile-optimized layouts
- **Custom Colors**: Brand-specific color palette
- **Animations**: Smooth transitions and micro-interactions

## 🌐 Internationalization

Multi-language support with translations for:
- English (EN)
- Hindi (HI)
- Spanish (ES)
- French (FR)
- German (DE)
- Arabic (AR)
- Chinese (ZH)
- Japanese (JA)

## 📱 Permissions

The app requires the following permissions:
- **Camera**: For oral health scanning
- **Photo Library**: To save and share scan results
- **Microphone**: For video recording during scans
- **Storage**: To store scan data locally

## 🔒 Security

- **Secure Storage**: Sensitive data stored using Expo SecureStore
- **Authentication**: JWT-based authentication with Supabase
- **Data Encryption**: All API communications are encrypted
- **Privacy**: User data is processed locally when possible

## 🚀 Deployment

### Development Build
```bash
expo build:android
expo build:ios
```

### Production Build
```bash
eas build --platform android
eas build --platform ios
```

### App Store Submission
1. Configure app.json with proper metadata
2. Generate production builds
3. Submit to respective app stores

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.0**: Initial release with core features
  - Authentication system
  - Camera integration
  - AI analysis
  - Multi-language support
  - Progress tracking

---

Built with ❤️ using React Native and Expo
