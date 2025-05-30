import { useState, useCallback } from "react";
import { useErrorHandler } from "./useErrorHandler";

export const useAsync = (asyncFunction) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { handleError } = useErrorHandler();

  const execute = useCallback(
    async (...params) => {
      try {
        setLoading(true);
        setError(null);
        const result = await asyncFunction(...params);
        return result;
      } catch (err) {
        const errorMessage = handleError(err);
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction, handleError]
  );

  return {
    loading,
    error,
    execute,
    setError,
  };
};
