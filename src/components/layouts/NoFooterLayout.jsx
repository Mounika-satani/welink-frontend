import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import '../../App.css';

const NoFooterLayout = () => {
    return (
        <div className="app">
            <Navbar />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default NoFooterLayout;
