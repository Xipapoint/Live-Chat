import { useState } from 'react';
import { toast, ToastPosition } from 'react-toastify';
import { AxiosError } from 'axios';

interface UseErrorToastResult {
  handleError: (error: unknown) => void;
  error: string | null;
  clearError: () => void;
}

const useErrorToast = (): UseErrorToastResult => {
  const [error, setError] = useState<string | null>(null);
  const toastErrorCofiguration = {
    position: "top-center" as ToastPosition,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  }

  const handleError = (error: unknown) => {
    if (error instanceof AxiosError) {
        console.log(error.status);
        
      if (error.status?.toString()?.startsWith('4' || '5')) {
        toast.error(error.message, toastErrorCofiguration);
        setError(error.message);
      } else if (error.request) {
        toast.error('No response from server. Please try again later.', toastErrorCofiguration);
        setError('No response from server. Please try again later.');
      }
        setError(error.message || 'Request setup error');
    } else if(error instanceof Error){
      console.log(error.message);
      toast.error('An unexpected error occurred. Check your internet connection!', toastErrorCofiguration);
      setError('An unexpected error occurred. Check your internet connection!');
    }
  };

  const clearError = () => {
    setError(null);
  };

  return { handleError, error, clearError };
};

export default useErrorToast;
