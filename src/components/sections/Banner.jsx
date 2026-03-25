import React, { useState, useEffect } from 'react';
import { getAllCategories } from '../../service/category';
import './Banner.css';

const Banner = () => {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const categories = await getAllCategories();
                // Admin can create multiple categories with type: 'BANNER' to rotate images
                const bannerCats = categories.filter(c =>
                    c.type === 'BANNER' ||
                    c.name.toUpperCase() === 'BANNER' ||
                    c.name.toUpperCase() === 'HOME'
                ).map(c => c.imageUrl).filter(Boolean);

                if (bannerCats.length > 0) {
                    setBanners(bannerCats);
                }
            } catch (error) {
                console.error('Failed to load banner images:', error);
            }
        };
        fetchBanners();
    }, []);

    useEffect(() => {
        if (banners.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 5000); // 5 seconds rotation

        return () => clearInterval(interval);
    }, [banners]);

    return (
        <section className="banner-section">
            <div className="banner-background-container">
                {banners.length > 0 ? (
                    banners.map((url, index) => (
                        <div
                            key={`${url}-${index}`}
                            className={`banner-slide ${index === currentIndex ? 'active' : ''}`}
                            style={{ backgroundImage: `linear-gradient(to bottom, rgba(15, 15, 25, 0.4) 0%, var(--bg-main) 100%), url(${url})` }}
                        />
                    ))
                ) : (
                    <div className="banner-slide active default-background" />
                )}
            </div>

            {/* <div className="banner-content">
                <h1 className="banner-title">
                    Discover the <br />
                    <span className="highlight">Future of AI</span>
                </h1>
            </div> */}
        </section>
    );
};

export default Banner;
