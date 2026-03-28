import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Dropdown, NavDropdown } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../service/api';
import CreatePostModal from '../CreatePostModal';
import logo from '../../assets/logo.png';
import logotext from '../../assets/logotext.png';
import './Navbar.css';

const AppNavbar = () => {
    const { user, dbUser, triggerLogin, logout } = useAuth();
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [services, setServices] = useState([]);

    React.useEffect(() => {
        fetch(`${API_URL}/services`)
            .then(res => res.json())
            .then(data => setServices(Array.isArray(data) ? data : []))
            .catch(() => setServices([]));
    }, []);

    return (
        <>
            <Navbar expand="lg" className="navbar-custom" variant="dark">
                <Container fluid className="px-5">
                    <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                        <img
                            src={logo}
                            alt="CommunEdge Logo"
                            style={{ height: '32px', marginRight: '10px' }}
                        />
                        <img
                            src={logotext}
                            alt="CommunEdge"
                            style={{ height: '26px' }}
                        />
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />

                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mx-auto nav-main-links">
                            <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
                            <Nav.Link as={NavLink} to="/feed">Feed</Nav.Link>
                            <Nav.Link as={NavLink} to="/discover">Discover</Nav.Link>
                            <Nav.Link as={NavLink} to="/industries">Industries</Nav.Link>
                            <NavDropdown title="Financing" id="financing-nav-dropdown" menuVariant="dark">
                                {services.map(service => (
                                    <NavDropdown.Item key={service.id} as={Link} to={`/help?service=${service.id}`}>
                                        {service.name}
                                    </NavDropdown.Item>
                                ))}
                            </NavDropdown>
                        </Nav>

                        <div className="d-flex align-items-center gap-3 navbar-actions">
                            {/* Show Upload Media if they are a startup, otherwise show Submit Startup */}
                            {dbUser?.role === 'STARTUP' ? (
                                <button
                                    className="btn-submit-startup"
                                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                                    onClick={() => setShowUploadModal(true)}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17 8 12 3 7 8" />
                                        <line x1="12" y1="3" x2="12" y2="15" />
                                    </svg>
                                    Upload Media
                                </button>
                            ) : (
                                <Link to="/submit-startup" className="text-decoration-none">
                                    <button className="btn-submit-startup">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                                            <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                                            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                                            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                                        </svg>
                                        Submit Startup
                                    </button>
                                </Link>
                            )}

                            {user ? (
                                <Dropdown align="end">
                                    <Dropdown.Toggle variant="link" id="dropdown-profile" className="btn-profile p-0 border-0">
                                        {dbUser?.photo_url ? (
                                            <img
                                                src={dbUser.photo_url}
                                                alt="Profile"
                                                style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'inline';
                                                }}
                                            />
                                        ) : null}
                                        <svg
                                            width="32" height="32" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                            style={{ display: dbUser?.photo_url ? 'none' : 'inline' }}
                                        >
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item disabled>{dbUser?.email || user.displayName || user.email}</Dropdown.Item>
                                        <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
                                        {dbUser?.role === 'STARTUP' && (
                                            <Dropdown.Item as={Link} to="/my-startup">My Startup</Dropdown.Item>
                                        )}
                                        <Dropdown.Item as={Link} to="/about">About</Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            ) : (
                                <button className="btn-profile" aria-label="Login" onClick={triggerLogin}>
                                    Login
                                </button>
                            )}
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <CreatePostModal
                show={showUploadModal}
                onHide={() => setShowUploadModal(false)}
            />
        </>
    );
};

export default AppNavbar;
