import React, { useState } from 'react';

const GiftBox = ({ content, onOpen }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        if (!isOpen) {
            setIsOpen(true);
            if (onOpen) onOpen();
        }
    };

    return (
        <div className={`gift-container ${isOpen ? 'open' : ''}`} onClick={handleClick}>
            <div className="gift-box">
                {/* Faces */}
                <div className="box-bottom"></div>
                <div className="box-front">
                    <div className="ribbon-vertical"></div>
                    <div className="ribbon-horizontal"></div>
                </div>
                <div className="box-back">
                    <div className="ribbon-vertical"></div>
                    <div className="ribbon-horizontal"></div>
                </div>
                <div className="box-left">
                    <div className="ribbon-horizontal"></div>
                </div>
                <div className="box-right">
                    <div className="ribbon-horizontal"></div>
                </div>

                {/* Lid (simplified as one moving piece for MVP) */}
                <div className="lid">
                    <div className="ribbon-vertical"></div>
                </div>

                {/* Content inside */}
                <div className="box-content">
                    {content}
                </div>
            </div>
        </div>
    );
};

export default GiftBox;
