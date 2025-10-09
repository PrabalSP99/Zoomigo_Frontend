import { useCallback } from 'react';
import { checkTokenAndHandleExpiration } from '../utils/tokenUtils';

export const useTokenValidation = () => {
  const validateToken = useCallback(() => {
    return checkTokenAndHandleExpiration();
  }, []);

  const executeWithTokenValidation = useCallback(async <T>(
    operation: () => Promise<T>
  ): Promise<T | null> => {
    if (!validateToken()) {
      return null; // Token is expired, user will be redirected
    }
    
    try {
      return await operation();
    } catch (error) {
      // If the operation fails due to authentication, the Apollo error link will handle it
      throw error;
    }
  }, [validateToken]);

  return {
    validateToken,
    executeWithTokenValidation
  };
};

