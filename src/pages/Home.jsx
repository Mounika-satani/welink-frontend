
import { useEffect } from 'react';
import Banner from '../components/sections/Banner';
import BannerTicker from '../components/sections/BannerTicker';
import FeatureThisWeek from '../components/sections/FeatureThisWeek';
import FeaturedStartups from '../components/sections/FeaturedStartups';
import TrendingThisWeek from '../components/sections/TrendingThisWeek';
import ExploreByIndustry from '../components/sections/ExploreByIndustry';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user, triggerLogin } = useAuth();

    useEffect(() => {
        if (!user) {
            const timer = setTimeout(() => {
                triggerLogin();
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [user, triggerLogin]);

    const handleInteraction = (e) => {
        if (!user) {
            e.preventDefault();
            e.stopPropagation();
            triggerLogin();
        }
    };

    return (
        <div className="home-page" onClickCapture={handleInteraction}>
            <BannerTicker />
            <Banner />
            <FeatureThisWeek />
            <FeaturedStartups />
            <TrendingThisWeek />
            <ExploreByIndustry />
        </div>
    );
};

export default Home;
