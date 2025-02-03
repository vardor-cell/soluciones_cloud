import React, { createContext, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {


    const [idUser, setIdUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(() => {
        const savedTheme = localStorage.getItem('token');
        return savedTheme ? savedTheme : 'light';
    });

    return (        
        <GlobalContext.Provider value={{token, setToken, idUser, setIdUser}}>
            {children}
        </GlobalContext.Provider>
    );
};
