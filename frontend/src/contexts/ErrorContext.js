import { createContext, useContext, useState } from 'react';

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useErrorContext = () => useContext(ErrorContext);
