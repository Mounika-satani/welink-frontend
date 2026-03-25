import React from 'react';
import './BannerTicker.css';

const BannerTicker = () => {
    // Suit the website: AI, Startups, Innovation, Connectivity
    const tickerText = [
        "Welink: Connecting Visionary AI Startups with Impactful Investors",
        "Explore the Future of Artificial Intelligence — Featured This Week: New AI Pioneers Are Breaking Ground",
        "Innovation Knows No Bounds — Submit Your AI Startup to Join Our Decentric Community Today!",
        "Live Post Feed: 25+ New Startups Joined Welink This Month — Join the Discussion Now",
    ];

    return (
        <div className="banner-ticker-container">
            <div className="banner-ticker-content">
                {/* Repeat list to ensure seamless transition */}
                {[...tickerText, ...tickerText].map((text, i) => (
                    <span key={i} className="ticker-text">
                        {text} <span className="ticker-bullet">•</span>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default BannerTicker;
