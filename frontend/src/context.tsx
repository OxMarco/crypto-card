import { ReactNode, createContext, useEffect, useState } from 'react';

export const AppContext = createContext({
  accessToken: '',
  saveAccessToken: (val: string) => {},
  id: '',
  saveId: (val: string) => {},
  cardholderId: '',
  saveCardholderId: (val: string) => {},
  clear: () => {},
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState('');
  const [id, setId] = useState('');
  const [cardholderId, setCardholderId] = useState('');

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedId = localStorage.getItem('id');
    const storedCardholderId = localStorage.getItem('cardholderId');

    if (storedAccessToken) {
      console.log('storedAccessToken', storedAccessToken);
      setAccessToken(storedAccessToken);
    }
    if (storedId) {
      setId(storedId);
    }
    if (storedCardholderId) {
      setCardholderId(storedCardholderId);
    }
  }, []);

  const saveAccessToken = (newAccessToken: string) => {
    localStorage.setItem('accessToken', newAccessToken);
    setAccessToken(newAccessToken);
  };

  const saveId = (newId: string) => {
    localStorage.setItem('id', newId);
    setId(newId);
  };

  const saveCardholderId = (newCardholderId: string) => {
    localStorage.setItem('cardholderId', newCardholderId);
    setCardholderId(newCardholderId);
  };

  const clear = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('id');
    localStorage.removeItem('cardholderId');
    setAccessToken('');
    setId('');
    setCardholderId('');
  };

  return (
    <AppContext.Provider
      value={{
        accessToken,
        saveAccessToken,
        id,
        saveId,
        cardholderId,
        saveCardholderId,
        clear,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
