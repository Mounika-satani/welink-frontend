import { useState, useEffect } from 'react';
import { API_URL } from '../service/api';
import './ContactFormModal.css';

const ContactFormModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
    const [errorMsg, setErrorMsg] = useState('');

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        company_name: '',
        general_details: '',
        service_id: '',
    });

    // Fetch available services when modal opens
    useEffect(() => {
        if (isOpen && services.length === 0) {
            fetch(`${API_URL}/services`)
                .then((res) => res.json())
                .then((data) => setServices(Array.isArray(data) ? data : []))
                .catch(() => setServices([]));
        }
    }, [isOpen]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSubmitStatus(null);
        setErrorMsg('');

        try {
            const res = await fetch(`${API_URL}/submissions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                setSubmitStatus('success');
                setForm({ name: '', email: '', phone: '', company_name: '', general_details: '', service_id: '' });
                setTimeout(() => {
                    setIsOpen(false);
                    setSubmitStatus(null);
                }, 2500);
            } else {
                setSubmitStatus('error');
                setErrorMsg(data.error || 'Something went wrong. Please try again.');
            }
        } catch {
            setSubmitStatus('error');
            setErrorMsg('Network error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setSubmitStatus(null);
        setErrorMsg('');
    };

    return (
        <>
            {/* Floating Action Button */}
            <button
                id="contact-fab"
                className={`contact-fab ${isOpen ? 'fab-active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Open contact form"
            >
                <span className="fab-icon">
                    {isOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    )}
                </span>
                <span className="fab-label">{isOpen ? 'Close' : 'Need Help?'}</span>
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="cfm-overlay" onClick={handleClose}>
                    <div
                        className="cfm-modal"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="cfm-title"
                    >
                        {/* Header */}
                        <div className="cfm-header">
                            <div className="cfm-header-content">
                                <div className="cfm-badge">✦ We're here to help</div>
                                <h2 id="cfm-title" className="cfm-title">How can we help?</h2>
                                <p className="cfm-subtitle">Tell us about your requirements and we'll get back to you shortly.</p>
                            </div>
                            <button className="cfm-close" onClick={handleClose} aria-label="Close modal">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Success State */}
                        {submitStatus === 'success' ? (
                            <div className="cfm-success">
                                <div className="cfm-success-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3>Message Sent!</h3>
                                <p>Thank you for reaching out. We'll be in touch very soon.</p>
                            </div>
                        ) : (
                            <form className="cfm-form" onSubmit={handleSubmit} noValidate>
                                {submitStatus === 'error' && (
                                    <div className="cfm-error-banner">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                        </svg>
                                        {errorMsg}
                                    </div>
                                )}

                                <div className="cfm-row">
                                    <div className="cfm-field">
                                        <label htmlFor="cfm-name">Full Name <span className="required">*</span></label>
                                        <input
                                            id="cfm-name"
                                            type="text"
                                            name="name"
                                            placeholder="John Doe"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="cfm-field">
                                        <label htmlFor="cfm-email">Email Address <span className="required">*</span></label>
                                        <input
                                            id="cfm-email"
                                            type="email"
                                            name="email"
                                            placeholder="john@example.com"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="cfm-row">
                                    <div className="cfm-field">
                                        <label htmlFor="cfm-phone">Phone Number</label>
                                        <input
                                            id="cfm-phone"
                                            type="tel"
                                            name="phone"
                                            placeholder="+91 98765 43210"
                                            value={form.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="cfm-field">
                                        <label htmlFor="cfm-company">Company Name</label>
                                        <input
                                            id="cfm-company"
                                            type="text"
                                            name="company_name"
                                            placeholder="Acme Inc."
                                            value={form.company_name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="cfm-field cfm-full">
                                    <label htmlFor="cfm-service">Service Required <span className="required">*</span></label>
                                    <select
                                        id="cfm-service"
                                        name="service_id"
                                        value={form.service_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">— Select a service —</option>
                                        {services.map((s) => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="cfm-field cfm-full">
                                    <label htmlFor="cfm-details">Tell Us More</label>
                                    <textarea
                                        id="cfm-details"
                                        name="general_details"
                                        placeholder="Describe your project, goals, or any questions you have..."
                                        rows={4}
                                        value={form.general_details}
                                        onChange={handleChange}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    id="cfm-submit-btn"
                                    className="cfm-submit"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="cfm-spinner" />
                                    ) : (
                                        <>
                                            <span>Send Message</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ContactFormModal;
