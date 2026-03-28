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
                const bannerCats = categories.filter(c =>
                    c.type === 'BANNER' ||
                    c.name.toUpperCase() === 'BANNER' ||
                    c.name.toUpperCase() === 'HOME'
                ).map(c => ({ url: c.imageUrl, description: c.description })).filter(b => b.url);

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
        }, 5000);

        return () => clearInterval(interval);
    }, [banners]);

    return (
        <section className="banner-section">
            <div className="banner-carousel-container">
                <div
                    className="banner-track"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {banners.length > 0 ? (
                        banners.map((banner, index) => (
                            <div
                                key={`${banner.url}-${index}`}
                                className="banner-slide"
                                style={{
                                    backgroundImage: `linear-gradient(to bottom, rgba(10, 10, 20, 0.45) 0%, var(--bg-main) 100%), url(${banner.url})`
                                }}
                            />
                        ))
                    ) : (
                        <div className="banner-slide default-background" />
                    )}
                </div>
            </div>

            {banners.length > 0 && banners[currentIndex]?.description && (
                <div className="banner-content" key={currentIndex}>
                    <p className="banner-description">{banners[currentIndex].description}</p>
                </div>
            )}
        </section>
    );
};

export default Banner;
