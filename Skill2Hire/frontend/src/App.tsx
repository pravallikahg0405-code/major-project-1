import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { AuthModal } from './components/common/AuthModal';
import { AppRouter } from './routes/AppRouter';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white">
          <Navbar />
          <main className="flex-1">
            <AppRouter />
          </main>
          <Footer />
          <AuthModal />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
