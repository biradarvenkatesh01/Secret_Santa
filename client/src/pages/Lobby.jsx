import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';

function Lobby() {
    const { roomId } = useParams();
    const socket = useSocket();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [isJoined, setIsJoined] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [error, setError] = useState('');
    const [isCreator, setIsCreator] = useState(false); // Client-side heuristic or explicit

    useEffect(() => {
        if (!socket) return;

        // Listen for updates
        socket.on('player_joined', (updatedParticipants) => {
            setParticipants(updatedParticipants);
        });

        socket.on('player_left', (updatedParticipants) => {
            setParticipants(updatedParticipants);
        });

        socket.on('game_started', ({ assignedTo }) => {
            // Navigate to Reveal page with state
            navigate('/reveal', { state: { assignedTo } });
        });

        return () => {
            socket.off('player_joined');
            socket.off('player_left');
            socket.off('game_started');
        };
    }, [socket, navigate]);

    const handleJoin = (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        socket.emit('join_room', { roomId, name }, (response) => {
            if (response.error) {
                setError(response.error);
            } else {
                setIsJoined(true);
                setParticipants(response.participants);
                // Simple heuristic: if I am the first one, I am likely the creator/leader.
                // Or better, backend should tell us. But for MVP:
                if (response.participants.length === 1) {
                    setIsCreator(true);
                }
            }
        });
    };

    const handleStartGame = () => {
        socket.emit('start_game', { roomId }, (response) => {
            if (response.error) {
                setError(response.error);
            }
        });
    };

    if (!isJoined) {
        return (
            <div className="lobby-container">
                <h2>Join Room: {roomId}</h2>
                <form onSubmit={handleJoin} className="card">
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        autoFocus
                    />
                    <button type="submit" className="btn-primary">Enter Lobby</button>
                    {error && <p className="error">{error}</p>}
                </form>
            </div>
        );
    }

    return (
        <div className="lobby-container">
            <div className="header">
                <h2>Room Code: <span className="highlight">{roomId}</span></h2>
                <p className="status">Waiting for host to start...</p>
            </div>

            <div className="participants-list card">
                <h3>Participants ({participants.length})</h3>
                <ul>
                    {participants.map((p, idx) => (
                        <li key={idx} className={p.name === name ? 'me' : ''}>
                            {p.name} {p.name === name && '(You)'}
                        </li>
                    ))}
                </ul>
            </div>

            {isCreator && (
                <div className="controls">
                    <button
                        onClick={handleStartGame}
                        className="btn-primary btn-large"
                        disabled={participants.length < 2}
                    >
                        Start Secret Santa
                    </button>
                    {participants.length < 2 && <p className="hint">Need at least 2 people to start.</p>}
                </div>
            )}
            {error && <p className="error">{error}</p>}
        </div>
    );
}

export default Lobby;
