import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import '../../App.css';

const FeedLayout = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', overflow: 'hidden' }}>
            <Navbar />
            <main style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default FeedLayout;
