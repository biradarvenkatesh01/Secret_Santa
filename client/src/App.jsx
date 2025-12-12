import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import Home from './pages/Home';
import Lobby from './pages/Lobby';
import Reveal from './pages/Reveal';

function App() {
  return (
    <SocketProvider>
      <Router>
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lobby/:roomId" element={<Lobby />} />
            <Route path="/reveal" element={<Reveal />} />
          </Routes>
        </div>
      </Router>
    </SocketProvider>
  );
}

export default App;
