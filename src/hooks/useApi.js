import { useCallback, useState } from 'react';
import { getApiErrorMessage } from '../services/api';

function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (requestFn) => {
    setLoading(true);
    setError(null);

    try {
      const response = await requestFn();
      return response.data;
    } catch (err) {
      const message = err.message || getApiErrorMessage(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    clearError,
  };
}

export default useApi;
