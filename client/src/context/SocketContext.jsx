import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // In production, we use relative path. In dev, we use hardcoded localhost:3001
        // BUT for a "Single Deployment Unit", the backend serves the frontend, so relative path is correct.
        // If we are developing (Vite on 5173/4000), we need localhost:3001.

        const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        // If port is 5173 or 4000, we are definitely in dev mode separate from backend
        const isSeparateFrontend = window.location.port === '5173' || window.location.port === '5174' || window.location.port === '4000';

        const url = isSeparateFrontend ? 'http://localhost:3001' : '/';

        const newSocket = io(url);
        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
