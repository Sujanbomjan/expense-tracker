# 💰 Expense Tracker Pro

<div align="center">

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-DD2C00?style=for-the-badge&logo=firebase&logoColor=white)

**A modern, feature-rich expense tracking application with multi-currency support and real-time cloud sync**

[Features](#-features) • [Getting Started](#-getting-started) • [Tech Stack](#-tech-stack) • [Screenshots](#-screenshots)

</div>

---

## ✨ Features

### 💱 **Multi-Currency Support**

- 🌍 **Real-time Exchange Rates** - Powered by ExchangeRate API
- 💵 **8 Major Currencies** - NPR, USD, EUR, GBP, INR, JPY, AUD, CAD
- 🔄 **Dual Currency System** - Set separate base and display currencies
- ⚡ **Automatic Conversion** - All transactions converted on-the-fly

### 📊 **Transaction Management**

- 📥 **Income & Expense Tracking** - Categorize every transaction
- 🏷️ **8 Predefined Categories**
  - 🍔 Food
  - 🚗 Transport
  - 🛍️ Shopping
  - 🎮 Entertainment
  - 💡 Bills
  - 🏥 Healthcare
  - 📚 Education
  - 📦 Other
- 📅 **Month-based Filtering** - View transactions by month
- 🗑️ **Quick Delete** - Remove transactions instantly

### 📈 **Visual Analytics**

- 🥧 **Category Pie Chart** - Beautiful expense breakdown
- 📊 **Monthly Bar Chart** - Income vs expenses (last 6 months)
- 💳 **Real-time Stats Cards** - Total income, expenses, and balance at a glance

### 🔐 **Authentication & Security**

- 🔑 **Firebase Authentication** - Secure email/password login
- 🛡️ **Protected Routes** - Authentication-required pages
- 🔒 **Secure Sessions** - Automatic session management

### ☁️ **Cloud Sync**

- 📡 **Firebase Realtime Database** - Cloud-first architecture
- ⚡ **Real-time Sync** - Changes reflected instantly across devices
- 💾 **Automatic Backup** - Never lose your data
- 📱 **Multi-device Support** - Access from anywhere

### 🎨 **Modern UI/UX**

- 🎯 **shadcn/ui Components** - Professional, accessible design system
- 📱 **Responsive Design** - Seamless experience on all devices
- 🌈 **Gradient Backgrounds** - Eye-catching modern aesthetic
- 🎭 **Lucide Icons** - Beautiful, consistent icon set
- ⏳ **Loading States** - Smooth animations and transitions

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Firebase project with Authentication and Realtime Database enabled
- ExchangeRate API key (free tier available)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/expense-tracker-pro.git
   cd expense-tracker-pro
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_DATABASE_URL=your_database_url

   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**

   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

The optimized build will be in the `dist` folder.

---

## 🛠️ Tech Stack

| Technology           | Purpose                   |
| -------------------- | ------------------------- |
| **React 19**         | UI Framework              |
| **TypeScript**       | Type Safety               |
| **Vite**             | Build Tool & Dev Server   |
| **Redux Toolkit**    | State Management          |
| **Firebase**         | Authentication & Database |
| **Recharts**         | Data Visualization        |
| **shadcn/ui**        | Component Library         |
| **Tailwind CSS**     | Styling                   |
| **Lucide React**     | Icons                     |
| **ExchangeRate API** | Currency Conversion       |

---

</div>

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) - Uses Babel for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) - Uses SWC for Fast Refresh

### Expanding ESLint Configuration

For production applications, enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      tseslint.configs.recommendedTypeChecked,
      // or tseslint.configs.strictTypeChecked for stricter rules
      tseslint.configs.stylisticTypeChecked, // Optional stylistic rules
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
```

### React-Specific Lint Rules

Install additional plugins for enhanced React linting:

```bash
npm install -D eslint-plugin-react-x eslint-plugin-react-dom
```

```js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      reactX.configs["recommended-typescript"],
      reactDom.configs.recommended,
    ],
  },
]);
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Recharts](https://recharts.org/) for the charting library
- [Firebase](https://firebase.google.com/) for backend services
- [ExchangeRate API](https://www.exchangerate-api.com/) for currency data

---

<div align="center">

**Made with ❤️ using React and TypeScript**

⭐ Star this repo if you find it helpful!

</div>
