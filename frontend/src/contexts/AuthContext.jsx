import React, { useEffect, useState } from 'react';
import { account, isAppwriteConfigured } from '../lib/appwrite';
import { AuthContext } from './auth-context';

const APPWRITE_ERROR =
  'Appwrite is not configured. Add VITE_APPWRITE_ENDPOINT and VITE_APPWRITE_PROJECT_ID to the frontend .env file.';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAppwriteConfigured || !account) {
      setUser(null);
      setLoading(false);
      return;
    }

    checkUser();
  }, []);

  const checkUser = async () => {
    if (!account) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const session = await account.get();
      setUser(session);
    } catch {
      console.log('No active session');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    if (!account) {
      return { success: false, error: APPWRITE_ERROR };
    }

    try {
      await account.createEmailPasswordSession(email, password);
      await checkUser();
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (email, password, name) => {
    if (!account) {
      return { success: false, error: APPWRITE_ERROR };
    }

    try {
      await account.create('unique()', email, password, name);
      await login(email, password);
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    if (!account) {
      setUser(null);
      return { success: true };
    }

    try {
      await account.deleteSession('current');
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Logout failed:', error);
      return { success: false, error: error.message };
    }
  };

  const getToken = async () => {
    if (!account) {
      return null;
    }

    try {
      const session = await account.getSession('current');
      return session.$id;
    } catch (error) {
      console.error('Failed to get token:', error);
      return null;
    }
  };

  const isAdmin = () => {
    try {
      return Boolean(user?.labels?.includes('admin'));
    } catch (error) {
      console.error('Failed to check admin status:', error);
      return false;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    getToken,
    isSignedIn: !!user,
    checkUser,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
