import React from 'react';
import './LegalPage.css';

const PrivacyPolicy = () => {
    return (
        <div className="legal-page">
            <div className="legal-container">

                <div className="legal-hero">
                    <div className="legal-badge">Legal</div>
                    <h1 className="legal-title">Privacy <span className="highlight">Policy</span></h1>
                    <p className="legal-subtitle">
                        This Privacy Policy governs the collection, use, processing, storage, and disclosure of information by CommunEdge in connection with your access to and use of the Platform and its associated services.
                    </p>
                </div>

                <div className="legal-section">
                    <div className="legal-section-title"><span className="section-num">1</span> Introduction and Scope</div>
                    <p>
                        This Privacy Policy governs the collection, use, processing, storage, and disclosure of information by
                        CommunEdge in connection with your access to and use of the Platform and its associated services.
                        This Policy applies to all users, including but not limited to founders, startups, investors, mentors,
                        and visitors. By accessing or using the Platform, you acknowledge that you have read, understood,
                        and agreed to the terms outlined herein.
                    </p>
                </div>

                <div className="legal-section">
                    <div className="legal-section-title"><span className="section-num">2</span> Information We Collect</div>
                    <p>
                        We may collect and process various categories of information depending on your interaction with the
                        Platform, including:
                    </p>
                    <ul>
                        <li><strong style={{ color: '#fff' }}>Personal Information:</strong> such as name, email address, phone number, professional role, and organization details</li>
                        <li><strong style={{ color: '#fff' }}>Business and Startup Information:</strong> including pitch decks, financial data, operational details, market insights, and other materials voluntarily submitted</li>
                        <li><strong style={{ color: '#fff' }}>Technical and Usage Data:</strong> including IP address, device identifiers, browser type, access logs, session data, and interaction patterns</li>
                        <li><strong style={{ color: '#fff' }}>Derived Data:</strong> including insights, recommendations, and analytical outputs generated through processing of user-provided and system-generated information</li>
                    </ul>
                    <p style={{ marginTop: '14px' }}>
                        All information is collected either directly from users, through platform interactions, or via automated technologies.
                    </p>
                </div>

                <div className="legal-section">
                    <div className="legal-section-title"><span className="section-num">3</span> Purpose and Legal Basis of Processing</div>
                    <p>
                        We process information for purposes including, but not limited to:
                    </p>
                    <ul>
                        <li>Enabling and facilitating interactions between startups, investors, and mentors</li>
                        <li>Providing, maintaining, and improving platform functionality and performance</li>
                        <li>Generating insights, recommendations, and analytical outputs</li>
                        <li>Communicating updates, opportunities, and relevant information</li>
                        <li>Ensuring platform integrity, preventing fraud, and maintaining security</li>
                    </ul>
                    <p style={{ marginTop: '14px' }}>
                        Processing of data is carried out on the basis of user consent, contractual necessity, legitimate
                        business interests, and compliance with applicable legal obligations.
                    </p>
                </div>

                <div className="legal-section">
                    <div className="legal-section-title"><span className="section-num">4</span> Data Sharing and Disclosure</div>
                    <p>
                        We do not sell personal data. However, information may be shared under the following circumstances:
                    </p>
                    <ul>
                        <li>With verified participants within the ecosystem (including investors, mentors, and partners) where such sharing is necessary to facilitate meaningful connections</li>
                        <li>With third-party service providers engaged for infrastructure, hosting, analytics, communication, or operational support</li>
                        <li>Where required by law, regulation, legal process, or governmental request</li>
                        <li>To enforce our terms, protect rights, prevent fraud, or ensure safety and security</li>
                    </ul>
                    <p style={{ marginTop: '14px' }}>
                        All such disclosures are subject to appropriate safeguards and reasonable efforts to ensure
                        confidentiality and responsible handling.
                    </p>
                </div>

                <div className="legal-section">
                    <div className="legal-section-title"><span className="section-num">5</span> Data Retention and Storage</div>
                    <p>
                        We retain information for as long as necessary to fulfill the purposes outlined in this Policy, including
                        operational, analytical, legal, regulatory, and security requirements.
                    </p>
                    <p>
                        We may retain anonymized, aggregated, or non-identifiable data indefinitely for research, analytics,
                        and product improvement purposes.
                    </p>
                    <p>
                        Data may be stored and processed in multiple jurisdictions, subject to applicable safeguards.
                    </p>
                </div>

                <div className="legal-section">
                    <div className="legal-section-title"><span className="section-num">6</span> Security Measures</div>
                    <p>
                        We implement commercially reasonable technical and organizational measures designed to protect
                        information against unauthorized access, misuse, alteration, or disclosure.
                    </p>
                    <p>
                        However, users acknowledge that no system can guarantee absolute security, and the transmission of
                        information over the internet carries inherent risks.
                    </p>
                    <p>
                        Users are encouraged to exercise discretion when sharing sensitive or confidential information.
                    </p>
                </div>

                <div className="legal-section">
                    <div className="legal-section-title"><span className="section-num">7</span> Cookies and Tracking Technologies</div>
                    <p>
                        The Platform may utilize cookies, tracking technologies, and similar mechanisms to enhance user
                        experience, analyze usage patterns, and optimize performance.
                    </p>
                    <p>
                        Users may control or disable cookies through browser settings; however, certain functionalities of
                        the Platform may be affected.
                    </p>
                </div>

                <div className="legal-section">
                    <div className="legal-section-title"><span className="section-num">8</span> User Rights and Responsibilities</div>
                    <p>
                        Subject to applicable laws, users may have the right to:
                    </p>
                    <ul>
                        <li>Access, update, or correct their information</li>
                        <li>Request deletion of data</li>
                        <li>Withdraw consent for certain processing activities</li>
                    </ul>
                    <p style={{ marginTop: '14px' }}>
                        Users are solely responsible for the accuracy, completeness, and legality of the information they
                        provide and are advised not to upload highly sensitive or confidential data unless necessary.
                    </p>
                </div>

                <div className="legal-section">
                    <div className="legal-section-title"><span className="section-num">9</span> Third-Party Services and External Links</div>
                    <p>
                        The Platform may contain links to third-party websites, services, or integrations. We do not control
                        and are not responsible for the privacy practices, policies, or content of such third parties.
                    </p>
                    <p>
                        Users are encouraged to review the privacy policies of external services before engaging with them.
                    </p>
                </div>

                <div className="legal-section">
                    <div className="legal-section-title"><span className="section-num">10</span> Limitation of Liability and Policy Updates</div>
                    <p>
                        To the maximum extent permitted by law, CommunEdge shall not be liable for any indirect,
                        incidental, consequential, or punitive damages arising out of or related to data handling,
                        unauthorized access, or system vulnerabilities.
                    </p>
                    <p>
                        We reserve the right to modify or update this Policy at any time. Continued use of the Platform
                        following such updates constitutes acceptance of the revised Policy.
                    </p>
                </div>

                <div className="legal-section">
                    <div className="legal-section-title"><span className="section-num">11</span> Contact Information</div>
                    <p>For any questions, concerns, or requests related to this Policy:</p>
                    <p><a href="mailto:support@communedge.com" className="legal-contact-link">support@communedge.com</a></p>
                </div>

            </div>
        </div>
    );
};

export default PrivacyPolicy;
