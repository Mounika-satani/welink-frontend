import React from 'react';
import { Accordion } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './FAQ.css';

const FAQ = () => {
    return (
        <div className="faq-page">
            <div className="faq-container">
                <h1 className="faq-title" style={{ textAlign: 'center' }}>FAQs</h1>
                <p className="faq-subtitle" style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-light)' }}>
                    Everything you need to know before you build with us
                </p>

                <h2 className="faq-section-title">Getting Started</h2>
                <Accordion className="faq-accordion" flush>
                    <Accordion.Item eventKey="gs1-1">
                        <Accordion.Header>What is CommunEdge?</Accordion.Header>
                        <Accordion.Body>
                            We are a comprehensive incubation ecosystem that empowers startups at every stage, from validating ideas to scaling and beyond.
                            Rather than simply showcasing startups, we work alongside them as long-term partners, offering guidance, mentorship, access to the right networks, funding, and opportunities needed to grow.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="gs1-2">
                        <Accordion.Header>Who can register on the platform?</Accordion.Header>
                        <Accordion.Body>
                            Any founder from idea stage to growth stage and beyond, can register.
                            We are there to support startups across every phase of their journey.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="gs1-3">
                        <Accordion.Header>How do I get my startup included on the site?</Accordion.Header>
                        <Accordion.Body>
                            You can submit your startup through the registration form by clicking on “submit startup” button with key details of your startup.
                            Our team reviews and curates each submission before onboarding.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="gs1-4">
                        <Accordion.Header>How do I advertise on CommunEdge?</Accordion.Header>
                        <Accordion.Body>
                            You can apply for featured placements or ecosystem visibility through our platform.
                            All promotions are curated to ensure relevance and high-quality exposure.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="gs1-5">
                        <Accordion.Header>How do I get access to the CommunEdge priority listing?</Accordion.Header>
                        <Accordion.Body>
                            Priority listing is provided to selected partners and integrated startups. You can opt for priority review or featured placement during or after submission. Our team will guide you through available premium options.
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                <h2 className="faq-section-title">Review Process</h2>
                <Accordion className="faq-accordion" flush>
                    <Accordion.Item eventKey="rp-1">
                        <Accordion.Header>What happens after I submit my startup?</Accordion.Header>
                        <Accordion.Body>
                            Your submission goes through an internal review for quality, clarity, and relevance. After that, it will be onboarded and guided for next steps, including visibility, connections and many more.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="rp-2">
                        <Accordion.Header>What types of startups does CommunEdge feature?</Accordion.Header>
                        <Accordion.Body>
                            We feature startups across all industries and stages, from idea to growth and beyond.
                            Preference is given to ventures with strong potential, innovation, and clear problem-solution fit.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="rp-3">
                        <Accordion.Header>How can I see the status of my startup submission?</Accordion.Header>
                        <Accordion.Body>
                            You will receive updates via email regarding your startup registration status.
                            For detailed queries, you can contact our support team.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="rp-4">
                        <Accordion.Header>How long does it take to get reviewed?</Accordion.Header>
                        <Accordion.Body>
                            Most startups are reviewed within 24–72 hours.
                            Complex submissions may take slightly longer depending on evaluation depth.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="rp-5">
                        <Accordion.Header>What's included in a priority listing?</Accordion.Header>
                        <Accordion.Body>
                            Priority listings offer faster review, enhanced visibility, and curated exposure.
                            They may also include stronger positioning for investor and mentor discovery.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="rp-6">
                        <Accordion.Header>Why wasn't my startup selected?</Accordion.Header>
                        <Accordion.Body>
                            Selection depends on clarity, validation, and overall fit with our ecosystem.
                            We aim to maintain high quality and may not onboard all submissions.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="rp-7">
                        <Accordion.Header>Can I resubmit my startup after it was rejected?</Accordion.Header>
                        <Accordion.Body>
                            Yes, you can reapply after improving your concept or traction.
                            We encourage resubmissions with stronger validation and clearer positioning.
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                <h2 className="faq-section-title">Visibility and Profile</h2>
                <Accordion className="faq-accordion" flush>
                    <Accordion.Item eventKey="vp-1">
                        <Accordion.Header>How do I get into the Trending Startups section?</Accordion.Header>
                        <Accordion.Body>
                            Startups are featured based on engagement and upvotes. Strong profiles, consistent updates, and activity improve your chances.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="vp-2">
                        <Accordion.Header>How can I track my startup's performance on CommunEdge?</Accordion.Header>
                        <Accordion.Body>
                            You can monitor engagement metrics and visibility through your dashboard by clicking on “My Startup”. For deeper insights, our team may share periodic performance updates.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="vp-3">
                        <Accordion.Header>What kind of content can I upload?</Accordion.Header>
                        <Accordion.Body>
                            You can share pitch decks, product details, and traction metrics. The more structured your content, the better your visibility and outcomes.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="vp-4">
                        <Accordion.Header>Can I edit my profile?</Accordion.Header>
                        <Accordion.Body>
                            Yes, you can update your startup profile anytime from your account dashboard. Changes may be reviewed to maintain quality and consistency.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="vp-5">
                        <Accordion.Header>How do I get featured again?</Accordion.Header>
                        <Accordion.Body>
                            Maintain strong engagement, update your progress, and stay active on the platform. You can also apply for re-feature or premium visibility options.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="vp-6">
                        <Accordion.Header>Do you share my contact information with third parties?</Accordion.Header>
                        <Accordion.Body>
                            No, your data is shared only within our curated ecosystem when relevant. We do not sell or publicly expose your personal or startup information.
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                <h2 className="faq-section-title">Getting Started</h2>
                <Accordion className="faq-accordion" flush>
                    <Accordion.Item eventKey="gs2-1">
                        <Accordion.Header>What is CommunEdge?</Accordion.Header>
                        <Accordion.Body>
                            We are a comprehensive incubation ecosystem that empowers startups at every stage, from validating ideas to scaling and beyond.
                            Rather than simply showcasing startups, we work alongside them as long-term partners, offering guidance, mentorship, access to the right networks, funding, and opportunities needed to grow.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="gs2-2">
                        <Accordion.Header>Who can register on the platform?</Accordion.Header>
                        <Accordion.Body>
                            Any founder from idea stage to growth stage and beyond, can register. We are there to support startups across every phase of their journey.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="gs2-3">
                        <Accordion.Header>Can I register without a complete product?</Accordion.Header>
                        <Accordion.Body>
                            Yes, even idea-stage startups are welcome. We help validate and refine concepts before they go to market.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="gs2-4">
                        <Accordion.Header>Is there any fee to register?</Accordion.Header>
                        <Accordion.Body>
                            No, basic registration is free for all founders. Advanced services or premium support may be introduced at later stages.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="gs2-5">
                        <Accordion.Header>What information is required to sign up?</Accordion.Header>
                        <Accordion.Body>
                            You’ll need basic personal details and a clear startup overview. Submitting a pitch deck is optional but improves evaluation quality.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="gs2-6">
                        <Accordion.Header>How long does approval take?</Accordion.Header>
                        <Accordion.Body>
                            Most applications are reviewed within 24–72 hours. Timelines may vary depending on submission quality and completeness.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="gs2-7">
                        <Accordion.Header>How do I advertise on CommunEdge?</Accordion.Header>
                        <Accordion.Body>
                            You can apply for featured placements or ecosystem visibility through our platform. All promotions are curated to ensure relevance and high-quality exposure.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="gs2-8">
                        <Accordion.Header>How do I get access to the CommunEdge priority listing?</Accordion.Header>
                        <Accordion.Body>
                            Priority listing is provided to selected partners and integrated startups. You can opt for priority review or featured placement during or after submission. Our team will guide you through available premium options.
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                <h2 className="faq-section-title">Startup Profile and Content</h2>
                <Accordion className="faq-accordion" flush>
                    <Accordion.Item eventKey="spc-1">
                        <Accordion.Header>What kind of content can I upload?</Accordion.Header>
                        <Accordion.Body>
                            You can share pitch decks, product details, and traction metrics. The more structured your content, the better your visibility and outcomes.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="spc-2">
                        <Accordion.Header>Is my data visible to everyone?</Accordion.Header>
                        <Accordion.Body>
                            No, access is controlled within a curated network. Your data is shared only with relevant investors, mentors, or experts.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="spc-3">
                        <Accordion.Header>Can I edit my startup profile later?</Accordion.Header>
                        <Accordion.Body>
                            Yes, you can update your profile anytime.
                            We recommend keeping it current to reflect your latest progress and traction.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="spc-4">
                        <Accordion.Header>What makes a strong profile?</Accordion.Header>
                        <Accordion.Body>
                            Clarity of problem, a solution, and measurable traction. A well-structured pitch deck significantly improves your chances.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="spc-5">
                        <Accordion.Header>Do you verify the content submitted?</Accordion.Header>
                        <Accordion.Body>
                            Yes, all submissions undergo a basic validation process. This ensures quality and credibility across the ecosystem.
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                <h2 className="faq-section-title">Mentorship and Support</h2>
                <Accordion className="faq-accordion" flush>
                    <Accordion.Item eventKey="ms-1">
                        <Accordion.Header>Will I get mentorship after registering?</Accordion.Header>
                        <Accordion.Body>
                            Yes, the startups are connected with relevant mentors. Support is tailored based on your stage, needs, and growth goals.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="ms-2">
                        <Accordion.Header>Do you help with pitch decks?</Accordion.Header>
                        <Accordion.Body>
                            Yes, we help refine structure, storytelling, and positioning. Our goal is to make your pitch investor-ready and compelling.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="ms-3">
                        <Accordion.Header>Can I request specific mentors or experts?</Accordion.Header>
                        <Accordion.Body>
                            You can share your preferences during onboarding. Final matching depends on relevance, availability, and alignment.
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                <h2 className="faq-section-title">Investors & Funding</h2>
                <Accordion className="faq-accordion" flush>
                    <Accordion.Item eventKey="if-1">
                        <Accordion.Header>How do you connect startups with investors?</Accordion.Header>
                        <Accordion.Body>
                            Through curated matchmaking, internal reviews, and targeted introductions. We focus on connecting you with investors aligned to your stage and vision.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="if-2">
                        <Accordion.Header>Is funding guaranteed?</Accordion.Header>
                        <Accordion.Body>
                            No, funding depends on multiple external factors. We maximize your chances through preparation, positioning, and access.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="if-3">
                        <Accordion.Header>When can I start meeting investors?</Accordion.Header>
                        <Accordion.Body>
                            Once your startup is validated and investment-ready. We ensure you enter conversations with strong positioning and clarity.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="if-4">
                        <Accordion.Header>What stages of funding do you support?</Accordion.Header>
                        <Accordion.Body>
                            We support startups from pre-seed and angel to growth stages and beyond. Our network evolves with your journey as you scale.
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                <h2 className="faq-section-title">Account and Access</h2>
                <Accordion className="faq-accordion" flush>
                    <Accordion.Item eventKey="aa-1">
                        <Accordion.Header>Can I have multiple startups under one account?</Accordion.Header>
                        <Accordion.Body>
                            Yes, multiple startups can be managed under one account. Each startup will be evaluated independently.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="aa-2">
                        <Accordion.Header>Can I delete my account or data?</Accordion.Header>
                        <Accordion.Body>
                            Yes, you can request account or data deletion anytime. We process such requests within a standard compliance timeframe.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="aa-3">
                        <Accordion.Header>Where do I contact for support?</Accordion.Header>
                        <Accordion.Body>
                            You can reach us at <a href="mailto:support@communedge.com" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>support@communedge.com</a>. Our team typically responds within 24–48 hours.
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                <div className="faq-contact-cta">
                    <h3>Still need help?</h3>
                    <p>If you can't find what you're looking for, feel free to reach out to our support team.</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.1rem', marginTop: '1rem', fontWeight: '500' }}>
                        <span>📧</span>
                        <a href="" style={{ color: 'inherit', textDecoration: 'none' }}>support@communedge.com</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
