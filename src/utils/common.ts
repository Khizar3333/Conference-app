import { Magic } from 'magic-sdk';
import { Dispatch, SetStateAction } from 'react';

export type LoginMethod = 'EMAIL' | 'SMS' | 'SOCIAL' | 'FORM';

export const logout = async (callback: () => void, magic: Magic) => {
  try {
    if (await magic.user.isLoggedIn()) {
      await magic.user.logout();
      console.log("Magic logout successful");
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loginMethod');
    localStorage.removeItem('isAuthLoading');
    callback();
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

export const saveUserInfo = (token: string, loginMethod: LoginMethod, userAddress: string) => {
  localStorage.setItem('token', token);
  localStorage.setItem('isAuthLoading', 'false');
  localStorage.setItem('loginMethod', loginMethod);
  localStorage.setItem('user', userAddress);
};