import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './ExploreByIndustry.css';

// SVG Icons for the industries
const CodeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
);

const SecurityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
);

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);

const BrainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path>
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path>
    </svg>
);

const industries = [
    {
        id: 1,
        title: "Coding",
        description: "Dev tools, code generations, pair programming",
        count: "100 Startups",
        icon: <CodeIcon />
    },
    {
        id: 2,
        title: "Security", // Using distinct icons for visual variety based on typical industry usage
        description: "Cybersecurity, fraud detection, privacy tools",
        count: "100 Startups",
        icon: <SecurityIcon />
    },
    {
        id: 3,
        title: "Communication",
        description: "Chatbots, translation, meeting assistants",
        count: "100 Startups",
        icon: <ChatIcon />
    },
    {
        id: 4,
        title: "Finance",
        description: "Trading algorithms, personal finance, fraud analysis",
        count: "100 Startups",
        icon: <BrainIcon />
    },
    {
        id: 5,
        title: "Healthcare",
        description: "Diagnosis aid, drug discovery, patient monitoring",
        count: "100 Startups",
        icon: <CodeIcon />
    },
    {
        id: 6,
        title: "Education",
        description: "Personalized learning, tutoring, content creation",
        count: "100 Startups",
        icon: <SecurityIcon />
    },
    {
        id: 7,
        title: "Marketing",
        description: "Content generation, ad optimization, analytics",
        count: "100 Startups",
        icon: <ChatIcon />
    },
    {
        id: 8,
        title: "Creative",
        description: "Image generation, music composition, video editing",
        count: "100 Startups",
        icon: <BrainIcon />
    }
];

const ExploreByIndustry = () => {
    return (
        <section className="explore-industry-section py-5">
            <Container className="px-5">
                <div className="text-center mb-5">
                    <h6 className="text-primary text-uppercase mb-2" style={{ letterSpacing: '1px', fontSize: '0.8rem' }}>Browse Categories</h6>
                    <h2 className="section-title mb-3">Explore by Industry</h2>
                    <p className="" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        Find AI startups transforming specific sectors and solving industry-specific challenges.
                    </p>
                </div>

                <Row className="g-4">
                    {industries.map((industry) => (
                        <Col lg={3} md={6} sm={12} key={industry.id}>
                            <Card className="industry-card h-100 border-1">
                                <Card.Body className="d-flex flex-column align-items-start p-4">
                                    <div className="icon-wrapper mb-4">
                                        {industry.icon}
                                    </div>
                                    <h5 className="industry-title mb-2">{industry.title}</h5>
                                    <p className="industry-desc mb-4  small">
                                        {industry.description}
                                    </p>
                                    <Link to={`/industry/${industry.title.toLowerCase()}`} className="industry-link mt-auto">
                                        {industry.count}
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </section>
    );
};

export default ExploreByIndustry;
