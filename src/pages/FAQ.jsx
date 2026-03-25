import React from 'react';
import { Accordion } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './FAQ.css';

const FAQ = () => {
    return (
        <div className="faq-page">
            <div className="faq-container">
                <h1 className="faq-title">Frequently Asked Questions</h1>

                <h2 className="faq-section-title">General</h2>
                <Accordion className="faq-accordion" flush>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>What is WeLink?</Accordion.Header>
                        <Accordion.Body>
                            WeLink is a platform dedicated to discovering, evaluating, and connecting with innovative startups. We provide a space for founders to showcase their ideas and for users to find the next big thing in AI and other emerging industries.
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="1">
                        <Accordion.Header>How do I get my startup included on the site?</Accordion.Header>
                        <Accordion.Body>
                            You can easily list your startup by signing up for an account, navigating to the "Submit Startup" section, and filling in the required details about your product, mission, and links. Once submitted, our team will review it for inclusion.
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="2">
                        <Accordion.Header>How do I advertise on WeLink?</Accordion.Header>
                        <Accordion.Body>
                            If you're interested in advertising or featuring your startup on our platform, please reach out via our Help/Contact page to discuss premium placement options and partnership opportunities.
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="3">
                        <Accordion.Header>How do I get access to the WeLink API?</Accordion.Header>
                        <Accordion.Body>
                            We currently offer an API for partners and select developers. To request API access, simply send us an inquiry through the Contact Us form detailing your use case, and our developer relations team will get back to you.
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                <h2 className="faq-section-title">Submissions</h2>
                <Accordion className="faq-accordion" flush>
                    <Accordion.Item eventKey="4">
                        <Accordion.Header>How do I submit my startup?</Accordion.Header>
                        <Accordion.Body>
                            To submit your startup, first create an account or log in. Then, click on the "Submit Startup" button in the navigation bar. Fill out the comprehensive form detailing your product, upload relevant media, and submit it for our team to review.
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="5">
                        <Accordion.Header>What happens after I submit my startup?</Accordion.Header>
                        <Accordion.Body>
                            After submission, our curation team will review your startup to ensure it meets our quality guidelines and fits our platform's focus. Typical review times are between 24-48 hours. Once approved, your startup will be live on WeLink and visible to our entire community.
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="6">
                        <Accordion.Header>What types of startups does WeLink feature?</Accordion.Header>
                        <Accordion.Body>
                            WeLink primarily focuses on early-stage, innovative startups in the tech space, including AI, SaaS, Web3, FinTech, and more. We love featuring products that introduce novel solutions, have passionate teams, and are ready for user feedback and growth.
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                <h2 className="faq-section-title">Review Process</h2>
                <Accordion className="faq-accordion" flush>
                    <Accordion.Item eventKey="7">
                        <Accordion.Header>How can I see the status of my startup submission?</Accordion.Header>
                        <Accordion.Body>
                            You can check the status of your submission by logging into your account and navigating to your profile or "My Startup" dashboard. The status will be marked as "Pending", "Under Review", or "Approved".
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="8">
                        <Accordion.Header>How long does it take to get reviewed?</Accordion.Header>
                        <Accordion.Body>
                            Our standard review process typically takes between 24 to 48 hours. During periods of high submission volume, it may take slightly longer. We appreciate your patience as we ensure the quality of startups on our platform.
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="9">
                        <Accordion.Header>How can I get a priority listing?</Accordion.Header>
                        <Accordion.Body>
                            Priority listings can be obtained by selecting the "Priority Review" or "Featured" option during the submission process. If you have already submitted your startup, you can upgrade your listing from your dashboard.
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="10">
                        <Accordion.Header>What's included in a priority listing?</Accordion.Header>
                        <Accordion.Body>
                            A priority listing ensures your startup is reviewed within 12 hours. Additionally, priority startups receive featured placement on the homepage, inclusion in our weekly newsletter, and highlighted visibility in search results.
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="11">
                        <Accordion.Header>What is your refund policy?</Accordion.Header>
                        <Accordion.Body>
                            If your startup is not selected, you will receive a full refund automatically. Once your startup has been featured, refunds are not available.
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="12">
                        <Accordion.Header>How long does a refund take?</Accordion.Header>
                        <Accordion.Body>
                            Refunds are processed automatically when your submission is not selected. It can take 5–10 business days for the refund to appear on your statement, depending on your bank.
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="13">
                        <Accordion.Header>Why wasn't my startup selected?</Accordion.Header>
                        <Accordion.Body>
                            We receive thousands of submissions every month. We prioritize startup submissions that have a clear value proposition, have an idea we haven't seen before, and have a well-designed landing page, because these are the things that our audience is looking for. You are welcome to resubmit in the future if you've improved on these things and think you are a better fit. Unfortunately we're not able to provide specific feedback on individual submissions.
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="14">
                        <Accordion.Header>Can I resubmit my startup after it was rejected?</Accordion.Header>
                        <Accordion.Body>
                            Yes, you are welcome to resubmit your startup in the future if you've made improvements based on our submission guidelines. Focus on improving your value proposition, design, and uniqueness before resubmitting.
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                <h2 className="faq-section-title">Featured Startups</h2>
                <Accordion className="faq-accordion" flush>
                    <Accordion.Item eventKey="15">
                        <Accordion.Header>How do I get into the Trending Startups section?</Accordion.Header>
                        <Accordion.Body>
                            The Trending Startups section is algorithmically generated based on user engagement, including upvotes, views, and comments within a specific timeframe.
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="16">
                        <Accordion.Header>Will my startup be included in the newsletter?</Accordion.Header>
                        <Accordion.Body>
                            Startups that receive high engagement or opt for priority listings may be selected to be featured in our weekly newsletter reaching thousands of subscribers.
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="17">
                        <Accordion.Header>How can I track my startup's performance on WeLink?</Accordion.Header>
                        <Accordion.Body>
                            You can monitor how many views, clicks, and upvotes your startup has directly from your customized "My Startup" dashboard.
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="18">
                        <Accordion.Header>How do I edit my post?</Accordion.Header>
                        <Accordion.Body>
                            To edit your post, go to your 'My Startup' dashboard and click the 'Edit' button on your active submission to update text, links, or media.
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="19">
                        <Accordion.Header>How do I get featured again?</Accordion.Header>
                        <Accordion.Body>
                            You can request to be featured again if you are launching a significant major feature, redesign, or pivot. Reach out through our contact form to inquire.
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="20">
                        <Accordion.Header>Do you share my contact information with third parties?</Accordion.Header>
                        <Accordion.Body>
                            We respect your privacy. We do not sell or share your personal contact information with third parties without your explicit consent.
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                <h2 className="faq-section-title">Accounts</h2>
                <Accordion className="faq-accordion" flush>
                    <Accordion.Item eventKey="21">
                        <Accordion.Header>How do I create an account?</Accordion.Header>
                        <Accordion.Body>
                            Click the 'Login' button in the navigation bar and follow the prompts to create an account using your email or preferred sign-in provider.
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="22">
                        <Accordion.Header>Where can I download invoices or receipts?</Accordion.Header>
                        <Accordion.Body>
                            Invoices and receipts for premium features can be requested through our support. We will automatically email you a receipt upon any transaction.
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="23">
                        <Accordion.Header>How do I delete my account?</Accordion.Header>
                        <Accordion.Body>
                            You can delete your account permanently by navigating to your profile and selecting the option to remove your data, or by contacting our support team directly.
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="24">
                        <Accordion.Header>How do I delete my startup submission?</Accordion.Header>
                        <Accordion.Body>
                            If you wish to remove your startup from WeLink, please navigate to 'My Startup' and select the delete option or contact our support team to remove it.
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                <div className="faq-contact-cta">
                    <h3>Still need help?</h3>
                    <p>If you can't find what you're looking for, feel free to reach out to our support team.</p>
                    <Link to="/help" className="btn-contact-support">Contact Support</Link>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
