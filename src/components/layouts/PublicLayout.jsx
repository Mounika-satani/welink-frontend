import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import '../../App.css';

const PublicLayout = () => {
    return (
        <div className="app">
            <Navbar />
            <main className="main-content">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default PublicLayout;
