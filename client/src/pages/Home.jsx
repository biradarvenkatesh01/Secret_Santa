import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import '../index.css'; // Will create this later

function Home() {
    const [joinCode, setJoinCode] = useState('');
    const [error, setError] = useState('');
    const socket = useSocket();
    const navigate = useNavigate();

    const handleCreateRoom = () => {
        if (!socket) return;
        socket.emit('create_room', (response) => {
            if (response.success) {
                // Implicitly creating, we navigate to lobby. 
                // We'll pass state to indicate this user created it, so they know to join as creator if needed?
                // Actually, we'll just handle it in Lobby.
                navigate(`/lobby/${response.roomId}`);
            } else {
                setError('Failed to create room');
            }
        });
    };

    const handleJoinRoom = (e) => {
        e.preventDefault();
        if (joinCode.trim().length !== 6) {
            setError('Room code must be 6 characters');
            return;
        }
        navigate(`/lobby/${joinCode.toUpperCase()}`);
    };

    return (
        <div className="home-container">
            <h1>Secret Santa Rooms 🎅</h1>
            <div className="card">
                <button onClick={handleCreateRoom} className="btn-primary">Create New Room</button>

                <div className="divider">OR</div>

                <form onSubmit={handleJoinRoom} className="join-form">
                    <input
                        type="text"
                        placeholder="Enter 6-digit Room Code"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        maxLength={6}
                    />
                    <button type="submit" className="btn-secondary">Join Room</button>
                </form>
                {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
}

export default Home;
