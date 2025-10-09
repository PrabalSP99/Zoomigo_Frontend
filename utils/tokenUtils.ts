import { toast } from 'react-toastify';

export interface TokenData {
  userId: string;
  email: string;
  exp: number;
  iat: number;
}

export const isTokenExpired = (token: string): boolean => {
  try {
    if (!token) return true;
    
    // Decode JWT token without verification (just to check expiration)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const tokenData: TokenData = JSON.parse(jsonPayload);
    const currentTime = Math.floor(Date.now() / 1000);
    
    return tokenData.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // If we can't parse the token, consider it expired
  }
};

export const handleTokenExpiration = () => {
  // Show error toast
  toast.error(
    '🔒 Your session has expired. Please log in again.',
    {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    }
  );

  // Clear local storage
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  // Redirect to login page after a short delay
  setTimeout(() => {
    window.location.href = '/auth?redirect=' + encodeURIComponent(window.location.pathname + window.location.search);
  }, 2000);
};

export const checkTokenAndHandleExpiration = (): boolean => {
  const token = localStorage.getItem('token');
  
  if (!token || isTokenExpired(token)) {
    handleTokenExpiration();
    return false;
  }
  
  return true;
};

export const getTokenData = (token: string): TokenData | null => {
  try {
    if (!token) return null;
    
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
};

export const getTokenExpirationTime = (token: string): Date | null => {
  const tokenData = getTokenData(token);
  return tokenData ? new Date(tokenData.exp * 1000) : null;
};

export const getTimeUntilExpiration = (token: string): number => {
  const tokenData = getTokenData(token);
  if (!tokenData) return 0;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return Math.max(0, tokenData.exp - currentTime);
};

