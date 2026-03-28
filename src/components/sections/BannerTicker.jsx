import React from 'react';
import './BannerTicker.css';

const BannerTicker = () => {
    // Suit the website: AI, Startups, Innovation, Connectivity
    const tickerText = [
        "FROM IDEAS TO FUNDING",
        "VALIDATE IDEAS",
        "GET MENTORED",
        "CRAFT PITCH DECKS",
        "CONNECT WITH THE INVESTORS",
        "LONG-TERM SUPPORT",
        "SCALE WITH CLARITY"
    ];

    return (
        <div className="banner-ticker-container">
            <div className="banner-ticker-content">
                {/* Repeat list to ensure seamless transition */}
                {[...tickerText, ...tickerText].map((text, i) => (
                    <span key={i} className="ticker-text">
                        {text} <span className="ticker-dot">•</span>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default BannerTicker;
