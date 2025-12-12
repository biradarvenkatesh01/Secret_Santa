import React from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import GiftBox from '../components/GiftBox';

function Reveal() {
    const location = useLocation();
    const navigate = useNavigate();

    // If no state (direct access), redirect to home
    if (!location.state || !location.state.assignedTo) {
        return <Navigate to="/" />;
    }

    const { assignedTo } = location.state;

    return (
        <div className="reveal-container">
            <h1>🎁 Assignment 🎁</h1>

            <p style={{ marginBottom: '50px', fontSize: '1.2rem' }}>Tap the gift to reveal your Secret Santa!</p>

            <GiftBox
                content={
                    <div className="revealed-content">
                        <h2 className="recipient-name">{assignedTo}</h2>
                        <div className="animation-party">🎉</div>
                    </div>
                }
            />

            <div style={{ marginTop: '100px' }}>
                <button onClick={() => navigate('/')} className="btn-secondary link-style">
                    Back to Home
                </button>
            </div>
        </div>
    );
}

export default Reveal;
