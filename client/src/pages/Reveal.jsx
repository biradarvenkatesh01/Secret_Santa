import React, { useState } from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';

function Reveal() {
    const location = useLocation();
    const navigate = useNavigate();
    const [revealed, setRevealed] = useState(false);

    // If no state (direct access), redirect to home
    if (!location.state || !location.state.assignedTo) {
        return <Navigate to="/" />;
    }

    const { assignedTo } = location.state;

    return (
        <div className="reveal-container">
            <h1>🎁 Assignment 🎁</h1>

            <div className="card reveal-card">
                <p>You are the Secret Santa for...</p>

                {!revealed ? (
                    <button onClick={() => setRevealed(true)} className="btn-reveal">
                        Click to Reveal
                    </button>
                ) : (
                    <div className="revealed-content">
                        <h2 className="recipient-name">{assignedTo}</h2>
                        <div className="animation-party">🎉</div>
                    </div>
                )}
            </div>

            <button onClick={() => navigate('/')} className="btn-secondary link-style">
                Back to Home
            </button>
        </div>
    );
}

export default Reveal;
