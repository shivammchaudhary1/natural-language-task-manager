import { useCallback } from "react";
import { toast } from "sonner";

export const useErrorHandler = () => {
  const handleError = useCallback(
    (error, defaultMessage = "An error occurred") => {
      let message = defaultMessage;

      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }

      // Handle specific error types
      if (error.response?.status === 401) {
        message = "Session expired. Please login again.";
      } else if (error.response?.status === 403) {
        message = "You do not have permission to perform this action.";
      } else if (error.response?.status === 404) {
        message = "The requested resource was not found.";
      } else if (error.response?.status >= 500) {
        message = "Server error. Please try again later.";
      }

      toast.error(message);
      return message;
    },
    []
  );

  return { handleError };
};
