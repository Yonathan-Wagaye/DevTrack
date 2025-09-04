# DevTrack - Personal Developer Task Manager

A productivity dashboard for developers to manage tasks and track GitHub commits.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install client dependencies:**
   ```bash
   cd client
   npm install
   ```

2. **Install server dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Start the development server:**
   ```bash
   # Terminal 1 - Start backend
   cd server
   npm run dev
   
   # Terminal 2 - Start frontend
   cd client
   npm run dev
   ```

## 🏗️ Project Structure

```
DevTrack/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── redux/         # Redux store and slices
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   └── package.json
├── server/                 # Node.js backend
│   ├── server.js          # Custom HTTP server
│   └── package.json
└── README.md
```

## 🎯 What You Need to Build

### Frontend Components
- **Navbar** - Navigation with theme toggle
- **Login Page** - Authentication form
- **Dashboard** - Overview with stats and charts
- **Tasks Page** - CRUD operations for tasks
- **Projects Page** - Project management
- **Commits Page** - GitHub commit tracking

### Backend API
- Custom HTTP server using Node.js built-in modules
- Endpoints for authentication, tasks, projects, and commits
- In-memory data storage (or simple JSON file)

### Features to Implement
- Task management (add, edit, delete, status updates)
- Project organization
- GitHub API integration for commit tracking
- Data visualization with charts
- Theme switching (light/dark)
- Responsive design

## 🛠️ Tech Stack

- **Frontend**: React 18, Redux Toolkit, React Router, Vite
- **Charts**: Recharts
- **Icons**: Lucide React
- **Backend**: Node.js (no Express)
- **Styling**: CSS with CSS variables for theming

## 💡 Development Tips

1. **Start with the Redux store** - The slices are already set up
2. **Build components incrementally** - Start with basic structure, then add functionality
3. **Use the existing CSS variables** for consistent theming
4. **Test routing** - React Router is already configured
5. **Implement authentication flow** - Redux auth slice is ready

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📚 Learning Resources

- [React Documentation](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Router](https://reactrouter.com/)
- [Recharts](https://recharts.org/)

---


