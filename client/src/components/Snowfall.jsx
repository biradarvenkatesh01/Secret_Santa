import React, { useEffect, useState } from 'react';

const Snowfall = () => {
    const [snowflakes, setSnowflakes] = useState([]);

    useEffect(() => {
        const count = 50;
        const newSnowflakes = [];
        for (let i = 0; i < count; i++) {
            newSnowflakes.push({
                left: Math.random() * 100 + 'vw',
                animationDuration: Math.random() * 3 + 2 + 's',
                animationDelay: Math.random() * 5 + 's',
                opacity: Math.random()
            });
        }
        setSnowflakes(newSnowflakes);
    }, []);

    return (
        <>
            {snowflakes.map((flake, index) => (
                <div
                    key={index}
                    className="snowflake"
                    style={{
                        left: flake.left,
                        animationDuration: flake.animationDuration,
                        animationDelay: flake.animationDelay,
                        opacity: flake.opacity
                    }}
                >
                    ❄
                </div>
            ))}
        </>
    );
};

export default Snowfall;
