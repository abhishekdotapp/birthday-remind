# 🎉 Birthday Reminder App

A modern, user-friendly birthday reminder application built with Next.js and Appwrite. Never forget important birthdays again!

![Birthday Reminder App](https://img.shields.io/badge/Next.js-15.5.2-black?style=for-the-badge&logo=next.js)
![Appwrite](https://img.shields.io/badge/Appwrite-Backend-red?style=for-the-badge&logo=appwrite)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- 🎂 **Birthday Management** - Add, edit, and delete birthday reminders
- 📅 **Smart Dashboard** - View upcoming birthdays with countdown timers
- 🏷️ **Categories** - Organize birthdays by Family, Friends, Colleagues, or Other
- 🔍 **Search & Filter** - Quickly find specific birthdays
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🔐 **User Authentication** - Secure sign-up and sign-in with Appwrite
- 🎨 **Modern UI** - Clean, intuitive interface with dark mode support
- 📝 **Notes** - Add descriptions and notes to birthday reminders
- ⚡ **Real-time Updates** - Instant updates when managing birthdays

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- An Appwrite account and project setup
- Basic knowledge of React/Next.js

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd birthday-remind
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_APPWRITE_PROJECT_NAME="birthday remind"
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
   NEXT_PUBLIC_APPWRITE_BIRTHDAY_COLLECTION_ID=your_collection_id
   NEXT_PUBLIC_APPWRITE_API_KEY=your_api_key
   ```

4. **Set up Appwrite Database**
   
   Create a collection in your Appwrite database with these attributes:
   
   | Attribute Name | Type | Required | Size | Default |
   |----------------|------|----------|------|----------|
   | `name` | String | Yes | 255 | - |
   | `date` | String | Yes | 10 | - |
   | `userId` | String | Yes | 255 | - |
   | `description` | String | No | 1000 | - |
   | `category` | String | Yes | 50 | "other" |
   | `reminderDays` | Integer | Yes | - | 1 |
   | `isRecurring` | Boolean | Yes | - | true |

5. **Configure Permissions**
   
   Set collection permissions:
   - **Create**: Users
   - **Read**: Users
   - **Update**: Users
   - **Delete**: Users

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
birthday-remind/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── dashboard/       # Dashboard page
│   │   ├── signin/          # Sign-in page
│   │   └── signup/          # Sign-up page
│   ├── components/          # React components
│   │   ├── AddBirthdayModal.tsx
│   │   ├── BirthdayCard.tsx
│   │   ├── BirthdayList.tsx
│   │   └── ProtectedRoute.tsx
│   ├── context/             # React contexts
│   │   ├── AuthContext.tsx
│   │   └── BirthdayContext.tsx
│   ├── lib/                 # Utility libraries
│   │   └── appwrite.ts      # Appwrite configuration
│   ├── services/            # API services
│   │   └── birthdayService.ts
│   └── types/               # TypeScript type definitions
│       └── birthday.ts
├── public/                  # Static assets
├── .env.local              # Environment variables
└── README.md
```

## 🎯 Usage

### Adding a Birthday
1. Navigate to the dashboard
2. Click "Add Birthday" button
3. Fill in the person's name, birthday date, and optional details
4. Choose a category (Family, Friend, Colleague, Other)
5. Set reminder preferences
6. Click "Add Birthday"

### Managing Birthdays
- **Edit**: Click the edit icon on any birthday card
- **Delete**: Click the delete icon and confirm
- **Search**: Use the search bar to find specific people
- **Filter**: Filter by category or upcoming birthdays

### Dashboard Features
- View all upcoming birthdays sorted by date
- See "Today" badges for current birthdays
- Countdown timers showing days until each birthday
- Color-coded urgency indicators

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Appwrite (Database, Authentication)
- **State Management**: React Context API
- **Icons**: Heroicons
- **Deployment**: Vercel (recommended)

## 🔧 Configuration

### Appwrite Setup
1. Create a new project in [Appwrite Console](https://cloud.appwrite.io/)
2. Create a database
3. Create a collection with the attributes listed above
4. Configure authentication methods
5. Set up proper permissions

### Environment Variables
All environment variables should be prefixed with `NEXT_PUBLIC_` to be accessible in the browser.

## 🚀 Deployment

### Deploy on Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Deploy on Netlify
1. Build the project: `npm run build`
2. Upload the `out` folder to Netlify
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Appwrite](https://appwrite.io/) for the backend services
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Heroicons](https://heroicons.com/) for the beautiful icons

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Happy Birthday Tracking! 🎉**
