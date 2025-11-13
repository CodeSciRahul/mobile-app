# Convoo

A modern, real-time messaging application built with React Native and Expo. Connect with friends, create groups, and stay in touch with an intuitive and beautiful chat experience.

## 📱 About

Convoo is a cross-platform mobile messaging application that enables seamless communication through private chats and group conversations. Built with modern technologies and best practices, Convoo provides a smooth, responsive user experience with support for media sharing, real-time messaging, and more.

## ✨ Features

- **Real-time Messaging**: Instant message delivery powered by Socket.IO
- **Private Chats**: One-on-one conversations with your contacts
- **Group Chats**: Create and manage group conversations
- **Contact Management**: Add and manage your contacts easily
- **Camera Integration**: Capture and share photos directly from the app
- **Dark Mode**: Automatic dark mode support for comfortable viewing
- **User Profiles**: Manage your profile and settings
- **Secure Storage**: Secure credential storage using Expo Secure Store
- **Offline Support**: AsyncStorage for local data persistence

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) (v54.0.21)
- **Language**: TypeScript
- **UI Library**: React Native with NativeWind (Tailwind CSS)
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Real-time Communication**: Socket.IO Client
- **Forms**: React Hook Form
- **HTTP Client**: Axios

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/go) app on your mobile device (for development)
- Android Studio (for Android development) or Xcode (for iOS development)

## 🚀 Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd mobile-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

### Running the App

After starting the development server, you can:

- Press `a` to open on Android emulator
- Press `i` to open on iOS simulator
- Scan the QR code with Expo Go app on your physical device
- Press `w` to open in web browser

## 📦 Building the App

### Android APK

To build an Android APK:

```bash
# Development build
npx expo run:android

# Production build with EAS
eas build --platform android
```

### iOS Build

To build for iOS:

```bash
# Development build
npx expo run:ios

# Production build with EAS
eas build --platform ios
```

## 📥 Download APK

<!-- Add your APK file here- comming soon in future -->
[Download Convoo APK (Latest Version)](./path/to/convoo.apk)

**Version**: 1.0.0  
**Size**: ~XX MB  
**Minimum Android Version**: Android 6.0 (API level 23)

> **Note**: Replace `./path/to/convoo.apk` with the actual path to your APK file once it's available.

## 🏗️ Project Structure

```
mobile-app/
├── app/                    # App screens and routes
│   ├── (drawer)/          # Drawer navigation screens
│   ├── chat/              # Chat screens
│   └── group/             # Group chat screens
├── components/            # Reusable UI components
├── services/              # API services
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── zustand/               # State management stores
├── config/                # Configuration files
├── lib/                   # Utility libraries
└── assets/                # Images, fonts, and other assets
```

## 🔧 Configuration

The app uses environment variables for configuration. Create a `.env` file in the root directory:

```env
API_URL=your_api_url_here
SOCKET_URL=your_socket_url_here
```

## 📱 Permissions

The app requires the following permissions:

- **Camera**: For capturing photos
- **Microphone**: For audio recording
- **Media Library**: For accessing and saving photos
- **Storage**: For file access

## 🧪 Development

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint

### Code Style

This project uses:
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety

## 📄 License

This project is private and proprietary.

---

Made with ❤️ using Expo and React Native
