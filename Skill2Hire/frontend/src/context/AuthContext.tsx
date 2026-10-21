import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, getErrorMessage } from '../services/api';
import { IUser } from '../types';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalReason: string;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (fullName: string, email: string, password: string, targetRole?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  openAuthModal: (reason?: string, onComplete?: () => void) => void;
  closeAuthModal: () => void;
  saveGuestDraft: (key: string, data: any) => void;
  getGuestDraft: <T>(key: string, defaultValue: T) => T;
  clearGuestDraft: (key: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('s2h_auth_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalReason, setAuthModalReason] = useState<string>('Create a free account to continue');
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);

  // Initialize and check token profile on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('s2h_auth_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/profile');
          if (res.data?.success && res.data?.data) {
            setUser({
              id: res.data.data._id || res.data.data.id,
              fullName: res.data.data.fullName,
              email: res.data.data.email,
              targetRole: res.data.data.targetRole,
              skills: res.data.data.skills || []
            });
          } else {
            localStorage.removeItem('s2h_auth_token');
            setToken(null);
          }
        } catch (error) {
          localStorage.removeItem('s2h_auth_token');
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.success && res.data?.data?.token) {
        const receivedToken = res.data.data.token;
        const receivedUser = res.data.data.user;

        localStorage.setItem('s2h_auth_token', receivedToken);
        setToken(receivedToken);
        setUser({
          id: receivedUser.id || receivedUser._id,
          fullName: receivedUser.fullName,
          email: receivedUser.email,
          targetRole: receivedUser.targetRole,
          skills: receivedUser.skills || []
        });

        setIsAuthModalOpen(false);

        // Execute queued progressive action if pending
        if (pendingCallback) {
          setTimeout(() => {
            pendingCallback();
            setPendingCallback(null);
          }, 200);
        }

        return { success: true };
      }
      return { success: false, error: 'Failed to authenticate.' };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  };

  const register = async (fullName: string, email: string, password: string, targetRole?: string) => {
    try {
      const res = await api.post('/auth/register', {
        fullName,
        email,
        password,
        targetRole: targetRole || 'Software Engineer'
      });

      if (res.data?.success && res.data?.data?.token) {
        const receivedToken = res.data.data.token;
        const receivedUser = res.data.data.user;

        localStorage.setItem('s2h_auth_token', receivedToken);
        setToken(receivedToken);
        setUser({
          id: receivedUser.id || receivedUser._id,
          fullName: receivedUser.fullName,
          email: receivedUser.email,
          targetRole: receivedUser.targetRole,
          skills: receivedUser.skills || []
        });

        setIsAuthModalOpen(false);

        // Execute queued progressive action if pending
        if (pendingCallback) {
          setTimeout(() => {
            pendingCallback();
            setPendingCallback(null);
          }, 200);
        }

        return { success: true };
      }
      return { success: false, error: 'Registration failed.' };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  };

  const logout = () => {
    localStorage.removeItem('s2h_auth_token');
    setToken(null);
    setUser(null);
  };

  const openAuthModal = (reason = 'Create a free account to continue', onComplete?: () => void) => {
    setAuthModalReason(reason);
    if (onComplete) {
      setPendingCallback(() => onComplete);
    } else {
      setPendingCallback(null);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingCallback(null);
  };

  // Guest State Helpers
  const saveGuestDraft = (key: string, data: any) => {
    try {
      localStorage.setItem(`s2h_guest_${key}`, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to persist draft in localStorage');
    }
  };

  const getGuestDraft = <T,>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(`s2h_guest_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  };

  const clearGuestDraft = (key: string) => {
    localStorage.removeItem(`s2h_guest_${key}`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        isAuthModalOpen,
        authModalReason,
        login,
        register,
        logout,
        openAuthModal,
        closeAuthModal,
        saveGuestDraft,
        getGuestDraft,
        clearGuestDraft
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
