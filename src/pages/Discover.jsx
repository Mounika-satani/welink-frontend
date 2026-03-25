import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { getAllStartups, getCategories } from '../service/startup';
import { useAuth } from '../context/AuthContext';
import './Discover.css';

// Inline SVG used as fallback when a logo URL is missing or broken
const LOGO_FALLBACK = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260' viewBox='0 0 260 260'><rect width='260' height='260' fill='%23111'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='80' font-family='sans-serif' fill='%23333'>🚀</text></svg>`;

// Icons
const ArrowUpRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="7" y1="17" x2="17" y2="7"></line>
        <polyline points="7 7 17 7 17 17"></polyline>
    </svg>
);

const MapPin = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);

const Eye = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);

const ThumbsUp = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
    </svg>
);

const Discover = () => {
    const { dbUser } = useAuth();
    const location = useLocation();
    const [activeCategory, setActiveCategory] = useState(location.state?.category || "All");
    const [startups, setStartups] = useState([]);
    const [categories, setCategories] = useState(["All"]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Pagination state
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const LIMIT = 6;

    // Fetch initial categories
    useEffect(() => {
        getCategories()
            .then(data => {
                // Just fetch the categories where type is INDUSTRY
                const industryCategories = data.filter(c => c.type === 'INDUSTRY');
                setCategories(["All", ...industryCategories.map(c => c.name)]);
            })
            .catch(err => console.error('Error fetching categories:', err));
    }, []);

    // Main fetch function
    const fetchStartups = useCallback(async (pageNum, isLoadMore = false, category = activeCategory, search = searchQuery) => {
        try {
            if (isLoadMore) setLoadingMore(true);
            else setLoading(true);

            const data = await getAllStartups(pageNum, LIMIT, category, search);

            // Filter out own startup if logged in (usually best done on backend, but keeping this logic for consistency)
            const filtered = data.startups.filter(s => !(dbUser && s.owner_user_id === dbUser.id));

            if (isLoadMore) {
                setStartups(prev => [...prev, ...filtered]);
            } else {
                setStartups(filtered);
            }

            setHasMore(pageNum < data.totalPages);
            setError(null);
        } catch (err) {
            console.error('Error fetching startups:', err);
            setError('Failed to load startups. Please try again later.');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [dbUser]);

    // Initial fetch / filter / search change
    useEffect(() => {
        setPage(1);
        fetchStartups(1, false, activeCategory, searchQuery);
    }, [activeCategory, searchQuery, fetchStartups]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchStartups(nextPage, true, activeCategory, searchQuery);
    };

    return (
        <div className="discover-page pt-5">
            <Container>
                {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

                <div className="mb-5">
                    <h1 className="fw-bold mb-2">Discover AI Startups</h1>
                    <p className="text-secondary mb-4">Explore our curated collection of innovative AI companies.</p>

                    <div className="search-input-wrapper">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search startup by name, category, or technology..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Row>
                    <Col md={3} className="d-none d-md-block mb-4">
                        <div className="filter-sidebar">
                            <h6 className="filter-title">Industry</h6>
                            <div className="filter-pills flex-column align-items-start">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        className={`filter-pill mb-2 w-100 text-start ${activeCategory === cat ? 'active' : ''}`}
                                        onClick={() => setActiveCategory(cat)}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </Col>

                    <Col xs={12} className="d-md-none mb-4">
                        <div className="filter-pills overflow-auto flex-nowrap pb-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    className={`filter-pill text-nowrap ${activeCategory === cat ? 'active' : ''}`}
                                    onClick={() => setActiveCategory(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </Col>

                    <Col md={9}>
                        <div className="d-flex flex-column gap-4">
                            {loading && page === 1 ? (
                                <div className="text-center py-5">
                                    <Spinner animation="border" variant="pink" />
                                </div>
                            ) : startups.length === 0 ? (
                                <div className="text-center py-5">
                                    <p className="text-muted">No startups found matching your criteria.</p>
                                </div>
                            ) : (
                                <>
                                    {startups.map((startup, idx) => (
                                        <Link
                                            to={`/startup/${startup.id}`}
                                            key={startup.id}
                                            className="startup-list-card text-decoration-none"
                                        >
                                            <div className="card-img-wrapper">
                                                <img
                                                    src={startup.logo_url || LOGO_FALLBACK}
                                                    alt={startup.name}
                                                    className="card-img"
                                                    onError={e => { e.target.onerror = null; e.target.src = LOGO_FALLBACK; }}
                                                />
                                            </div>
                                            <div className="card-body-content">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <div className="badge-group">
                                                        {startup.is_featured && <span className="custom-badge badge-featured">Featured</span>}
                                                        {startup.status === 'APPROVED' && <span className="custom-badge badge-verified">Verified</span>}

                                                        {/* Show all categories associated with the startup */}
                                                        {(() => {
                                                            const cats = new Set();
                                                            if (startup.industry?.name) cats.add(startup.industry.name);
                                                            if (startup.industries) startup.industries.forEach(i => cats.add(i.name));

                                                            return Array.from(cats).map((catName, i) => (
                                                                <span key={i} className="badge-category">
                                                                    {catName}
                                                                </span>
                                                            ));
                                                        })()}
                                                    </div>
                                                    <div className="arrow-link">
                                                        <ArrowUpRight />
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <h3 className="startup-title">{startup.name}</h3>
                                                    <p className="startup-desc">{startup.tagline || startup.description}</p>
                                                </div>

                                                <div className="card-footer-stats">
                                                    <div className="stat-item">
                                                        <span className="location-icon"><MapPin /></span>
                                                        {startup.location || 'Remote'}
                                                    </div>
                                                    <div className="d-flex gap-3">
                                                        <div className="stat-item">
                                                            <span className="stat-icon"><Eye /></span> {startup.metrics?.total_views || 0}
                                                        </div>
                                                        <div className="stat-item">
                                                            <span className="stat-icon"><ThumbsUp /></span> {startup.metrics?.total_upvotes || 0}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}

                                    {hasMore && (
                                        <div className="text-center mt-5">
                                            <Button
                                                variant="outline-light"
                                                className="btn-load-more"
                                                onClick={handleLoadMore}
                                                disabled={loadingMore}
                                            >
                                                {loadingMore ? <Spinner animation="border" size="sm" className="me-2" /> : null}
                                                {loadingMore ? 'Loading...' : 'Load More Startups'}
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Discover;
