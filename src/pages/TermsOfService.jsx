import React from 'react';
import './LegalPage.css';

const TermsOfService = () => {
    return (
        <div className="legal-page">
            <div className="legal-container">

                <div className="legal-hero">
                    <div className="legal-badge">Legal</div>
                    <h1 className="legal-title">Terms of <span className="highlight">Service</span></h1>
                    <p className="legal-subtitle">
                        By accessing WeLink, you agree to operate within a curated ecosystem built for serious founders and capital partners.
                    </p>
                </div>

                <div className="legal-section">
                    <div className="legal-section-title"><span className="section-num">1</span> Acceptance</div>
                    <p>
                        By accessing WeLink, you agree to operate within a curated ecosystem built for serious founders and capital partners. These terms govern your use of the WeLink platform and all associated services.
                    </p>
                </div>

                <div className="legal-section">
                    <div className="legal-section-title"><span className="section-num">2</span> Scope of Services</div>
                    <p>WeLink provides:</p>
                    <ul>
                        <li>Startup discovery, validation, and strategic advisory</li>
                        <li>Investor access across pre-seed, angel, seed, and growth stages</li>
                        <li>Mentorship connections with domain experts and operators</li>
                        <li>End-to-end incubation support across the founder journey</li>
                    </ul>
                    <p style={{ marginTop: '14px' }}>We facilitate 100+ investor-founder interactions monthly but do not guarantee funding outcomes.</p>
                </div>

                <div className="legal-section">
                    <div className="legal-section-title"><span className="section-num">3</span> User Responsibilities</div>
                    <p>All users of WeLink must:</p>
                    <ul>
                        <li>Provide accurate, complete, and verifiable information</li>
                        <li>Maintain confidentiality of sensitive information shared within the network</li>
                        <li>Engage professionally with founders, investors, and mentors</li>
                        <li>Not misuse or attempt to reverse-engineer any part of the platform</li>
                    </ul>
                </div>

                <div className="legal-section">
                    <div className="legal-section-title"><span className="section-num">4</span> Intellectual Property</div>
                    <ul>
                        <li>Founders retain full ownership of their submitted materials, pitch decks, and startup data</li>
                        <li>A limited, non-exclusive license is granted to WeLink for evaluation, mentorship facilitation, and investor sharing within our verified network</li>
                        <li>WeLink's platform design, content, and code remain the exclusive property of WeLink</li>
                    </ul>
                </div>

                <div className="legal-section">
                    <div className="legal-section-title"><span className="section-num">5</span> Limitation of Liability</div>
                    <p>While WeLink enables access to 150+ investors and domain experts, we are not liable for:</p>
                    <ul>
                        <li>Investment decisions or deal outcomes resulting from platform interactions</li>
                        <li>Startup performance, financial losses, or forward projections</li>
                        <li>Third-party actions taken by investors, mentors, or partners</li>
                    </ul>
                </div>

                <div className="legal-section">
                    <div className="legal-section-title"><span className="section-num">6</span> Termination</div>
                    <p>WeLink reserves the right to suspend or permanently revoke access in cases of:</p>
                    <ul>
                        <li>Misrepresentation of startup information, identity, or intent</li>
                        <li>Breach of trust or confidentiality within the network</li>
                        <li>Misuse, abuse, or exploitation of platform access or resources</li>
                    </ul>
                </div>

                <div className="legal-section">
                    <div className="legal-section-title"><span className="section-num">7</span> Jurisdiction</div>
                    <p>
                        These terms are governed under the laws of India. Any disputes arising out of or in connection with WeLink's services shall be resolved in alignment with applicable Indian regulatory and legal frameworks.
                    </p>
                    <p style={{ marginTop: '14px' }}>
                        For legal inquiries, contact: <a href="mailto:weiteredge240@gmail.com" className="legal-contact-link">weiteredge240@gmail.com</a>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default TermsOfService;
