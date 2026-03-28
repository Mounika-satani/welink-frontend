import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCategories, createStartup, addFounder, updateStartup, getMyStartup } from '../service/startup';
import { API_URL } from '../service/api';
import BannerCropper from '../components/BannerCropper';
import './SubmitStartup.css';

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - i);
const ROLE_OPTIONS = ['CEO', 'CTO', 'Founder', 'Co-Founder', 'CMO', 'CFO', 'COO', 'Product', 'Engineering'];

const emptyFounder = () => ({ name: '', role: '', linkedIn: '', photo: null });

const SubmitStartup = () => {
    const { user, token } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const editMode = location.state?.editMode === true;

    const [currentStep, setCurrentStep] = useState(1);
    const [industrySearch, setIndustrySearch] = useState('');
    const [categories, setCategories] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [startupId, setStartupId] = useState(null);
    const [errors, setErrors] = useState({});

    const clearError = (field) => setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });

    const validateStep = (step) => {
        const e = {};
        if (step === 1) {
            if (!formData.startupName.trim()) e.startupName = 'Startup name is required.';
            if (!formData.tagline.trim()) e.tagline = 'Tagline is required.';
            if (formData.industry_ids.length === 0) e.industry_ids = 'Please select at least one industry.';
            if (!formData.logo && !formData.existingLogoUrl) e.logo = 'Please upload a startup logo.';
        }
        if (step === 2) {
            if (!formData.description.trim()) e.description = 'Product description is required.';
            // Validate all founders
            const firstFounder = founders[0];
            if (!firstFounder || !firstFounder.name.trim()) {
                e.founderName = 'Primary founder name is required.';
            } else if (!firstFounder.role.trim()) {
                e.founderRole = 'Primary founder role is required.';
            }

            // Check if any other added founders are missing info
            founders.slice(1).forEach((f, idx) => {
                if (f.name.trim() && !f.role.trim()) {
                    e[`founderRole_${idx + 1}`] = `Role is required for ${f.name}.`;
                } else if (!f.name.trim() && f.role.trim()) {
                    e[`founderName_${idx + 1}`] = `Name is required for role ${f.role}.`;
                }
            });
        }
        if (step === 3) {
            if (!formData.stage) e.stage = 'Please select a funding stage.';
            if (!formData.incorporationCert && !formData.existingCertUrl) {
                e.incorporationCert = 'Incorporation certificate is mandatory.';
            }
            if (!editMode && !formData.termsAccepted) {
                setSubmitError('Please accept the terms to submit.');
                return false;
            }
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const [bannerRawSrc, setBannerRawSrc] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const [bannerPreviewUrl, setBannerPreviewUrl] = useState(null);
    const bannerInputRef = useRef();

    const [formData, setFormData] = useState({
        startupName: '',
        tagline: '',
        industry_ids: [],
        website: '',
        logo: null,
        banner: null,
        description: '',
        stage: '',
        location: '',
        teamSize: '',
        foundedYear: '',
        incorporationCert: null,
        termsAccepted: false,
        linkedin_url: '',
        twitter_url: '',
        instagram_url: '',
        facebook_url: '',
    });

    const [founders, setFounders] = useState([emptyFounder()]);

    const [existingStartup, setExistingStartup] = useState(null);
    const [checkingExisting, setCheckingExisting] = useState(true);

    useEffect(() => {
        getCategories()
            .then(data => {
                const industryOnly = data.filter(c => c.type === 'INDUSTRY' || !c.type);
                setCategories(industryOnly);
            })
            .catch(() => setCategories([]));
    }, []);

    useEffect(() => {
        if (!token) {
            setCheckingExisting(false);
            return;
        }

        // Check for existing startup to prevent duplicate submissions
        getMyStartup(token)
            .then(s => {
                if (s && s.id) {
                    setExistingStartup(s);
                    // If we are in edit mode, the subsequent useEffect handles data loading
                }
            })
            .catch(() => {
                // 404 means no startup yet, which is fine
            })
            .finally(() => setCheckingExisting(false));
    }, [token]);

    useEffect(() => {
        if (!editMode || !token) return;
        getMyStartup(token).then(s => {
            setStartupId(s.id);
            setFormData(prev => ({
                ...prev,
                startupName: s.name || '',
                tagline: s.tagline || '',
                industry_ids: s.industries ? s.industries.map(i => i.id) : (s.industry_id ? [s.industry_id] : []),
                website: s.website_url || '',
                description: s.description || '',
                stage: s.funding_stage || '',
                location: s.location || '',
                teamSize: s.team_size ? String(s.team_size) : '',
                foundedYear: s.founded_year ? String(s.founded_year) : '',
                termsAccepted: true,
                logo: null,
                incorporationCert: null,
                existingLogoUrl: s.logo_url || null,
                existingBannerUrl: s.banner_url || null,
                existingCertUrl: s.incorporation_certificate_url || null,
                linkedin_url: s.linkedin_url || '',
                twitter_url: s.twitter_url || '',
                instagram_url: s.instagram_url || '',
                facebook_url: s.facebook_url || '',
            }));
            if (Array.isArray(s.founders) && s.founders.length > 0) {
                setFounders(s.founders.map(f => ({
                    id: f.id,
                    name: f.name || '',
                    role: f.role || '',
                    linkedIn: f.linkedin_url || '',
                    photo: null,
                    existingPhotoUrl: f.photo_url || null,
                })));
            }
        }).catch(() => { });
    }, [editMode, token]);

    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'file' ? files[0] : value),
        }));
        clearError(name);
    };

    const handleFounderChange = (index, e) => {
        const { name, value, type, files } = e.target;
        setFounders(prev => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                [name]: type === 'file' ? files[0] : value,
            };
            return updated;
        });
    };

    const toggleFounderRole = (index, role) => {
        setFounders(prev => {
            const updated = [...prev];
            const currentRoles = updated[index].role ? updated[index].role.split(', ') : [];
            let newRoles;
            if (currentRoles.includes(role)) {
                newRoles = currentRoles.filter(r => r !== role);
            } else {
                newRoles = [...currentRoles, role];
            }
            updated[index] = {
                ...updated[index],
                role: newRoles.join(', '),
            };
            return updated;
        });
    };

    const addAnotherFounder = () => setFounders(prev => [...prev, emptyFounder()]);

    const removeFounder = (index) =>
        setFounders(prev => prev.filter((_, i) => i !== index));

    const handleNext = () => {
        if (!validateStep(currentStep)) return;
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
            window.scrollTo(0, 0);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            window.scrollTo(0, 0);
        }
    };

    const handleSubmit = async () => {
        if (!validateStep(currentStep)) return;

        setSubmitting(true);
        setSubmitError('');

        try {
            if (editMode && startupId) {
                await updateStartup(token, startupId, {
                    name: formData.startupName,
                    tagline: formData.tagline,
                    description: formData.description,
                    industry_id: formData.industry_ids[0] || '',
                    website_url: formData.website,
                    funding_stage: formData.stage,
                    location: formData.location,
                    team_size: formData.teamSize,
                    founded_year: formData.foundedYear,
                    linkedin_url: formData.linkedin_url,
                    twitter_url: formData.twitter_url,
                    instagram_url: formData.instagram_url,
                    facebook_url: formData.facebook_url,
                }, formData.logo, formData.incorporationCert, formData.banner);

                for (const f of founders.filter(f => f.name.trim())) {
                    if (f.id) {
                        const fd = new FormData();
                        fd.append('name', f.name);
                        if (f.role) fd.append('role', f.role);
                        if (f.linkedIn) fd.append('linkedin_url', f.linkedIn);
                        if (f.photo) fd.append('photo', f.photo);
                        await fetch(`${API_URL}/founders/${f.id}`, {
                            method: 'PUT',
                            headers: { Authorization: `Bearer ${token}` },
                            body: fd,
                        });
                    } else {
                        await addFounder({
                            startup_id: startupId,
                            name: f.name,
                            role: f.role || null,
                            linkedin_url: f.linkedIn || null,
                        }, f.photo);
                    }
                }
            } else {
                const fd = new FormData();
                // Append text fields first for better multer parsing
                fd.append('name', formData.startupName);
                fd.append('tagline', formData.tagline);
                fd.append('description', formData.description);
                // Append all selected industry IDs
                formData.industry_ids.forEach(id => fd.append('industry_ids', id));
                // Set primary industry_id for legacy support
                if (formData.industry_ids.length > 0) {
                    fd.append('industry_id', formData.industry_ids[0]);
                }
                if (formData.website) fd.append('website_url', formData.website);
                if (formData.stage) fd.append('funding_stage', formData.stage);
                if (formData.location) fd.append('location', formData.location);
                if (formData.teamSize) fd.append('team_size', formData.teamSize);
                if (formData.foundedYear) fd.append('founded_year', formData.foundedYear);

                // Social links
                fd.append('linkedin_url', formData.linkedin_url || '');
                fd.append('twitter_url', formData.twitter_url || '');
                fd.append('instagram_url', formData.instagram_url || '');
                fd.append('facebook_url', formData.facebook_url || '');

                // Append files last
                if (formData.logo) fd.append('logo', formData.logo);
                if (formData.banner) fd.append('banner', formData.banner);
                if (formData.incorporationCert) fd.append('incorporation_certificate', formData.incorporationCert);

                const res = await fetch(`${API_URL}/startups/create`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                    body: fd,
                });
                if (!res.ok) {
                    const err = await res.json().catch(() => ({ error: res.statusText }));
                    throw new Error(err.error || 'Failed to create startup');
                }
                const startup = await res.json();

                const validFounders = founders.filter(f => f.name.trim());
                for (const f of validFounders) {
                    await addFounder({
                        startup_id: startup.id,
                        name: f.name,
                        role: f.role || null,
                        linkedin_url: f.linkedIn || null,
                    }, f.photo);
                }
            }

            setCurrentStep(4);
            window.scrollTo(0, 0);
        } catch (err) {
            setSubmitError(err.message || 'Submission failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const FileUploadBox = ({ id, name, accept, file, onChange, hint, icon }) => (
        <div className="file-upload-box" onClick={() => document.getElementById(id).click()} style={{ cursor: 'pointer' }}>
            <div className="upload-icon">{icon}</div>
            <input type="file" name={name} id={id} className="d-none" accept={accept} onChange={onChange} />
            <p className="upload-text mb-0">
                {file
                    ? <span className="text-success fw-semibold">✓ {file.name}</span>
                    : <><span className="text-primary" style={{ cursor: 'pointer' }}>Browse</span> or drag &amp; drop</>}
            </p>
            {hint && <small className="d-block mt-1">{hint}</small>}
        </div>
    );

    const StepBasics = () => (
        <div className="startup-form-card">
            <h2 className="section-title">Basic Information</h2>
            <p className="section-subtitle">Tell us about your startup's core identity.</p>

            <Row className="g-4 mb-4">
                <Col md={6}>
                    <Form.Group>
                        <Form.Label className="form-label">Startup Name *</Form.Label>
                        <Form.Control type="text" name="startupName" placeholder="e.g. NeuralFlow"
                            className={`form-control-dark ${errors.startupName ? 'field-error' : ''}`}
                            value={formData.startupName} onChange={handleInputChange} />
                        {errors.startupName && <p className="field-error-msg">{errors.startupName}</p>}
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label className="form-label">Tagline *</Form.Label>
                        <Form.Control type="text" name="tagline" placeholder="e.g. AI for Supply Chain"
                            className={`form-control-dark ${errors.tagline ? 'field-error' : ''}`}
                            value={formData.tagline} onChange={handleInputChange} />
                        {errors.tagline && <p className="field-error-msg">{errors.tagline}</p>}
                    </Form.Group>
                </Col>

                <Col md={12}>
                    <Form.Group>
                        <Form.Label className="form-label">Industry *</Form.Label>

                        {/* Search bar */}
                        <div className="industry-search-wrapper">
                            <svg className="industry-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                                type="text"
                                className="industry-search-input"
                                placeholder="Search industries..."
                                value={industrySearch}
                                onChange={e => setIndustrySearch(e.target.value)}
                            />
                            {industrySearch && (
                                <button type="button" className="industry-search-clear" onClick={() => setIndustrySearch('')}>✕</button>
                            )}
                        </div>


                        {/* Selected pills */}
                        {formData.industry_ids.length > 0 && (
                            <div className="industry-selected-pills">
                                {formData.industry_ids.map(id => {
                                    const cat = categories.find(c => c.id === id);
                                    return cat ? (
                                        <span key={id} className="industry-pill">
                                            {cat.name}
                                            <button type="button" className="industry-pill-remove"
                                                onClick={() => setFormData(prev => ({
                                                    ...prev,
                                                    industry_ids: prev.industry_ids.filter(i => i !== id),
                                                }))}>✕</button>
                                        </span>
                                    ) : null;
                                })}
                            </div>
                        )}

                        {/* Filtered full list */}
                        {categories.length > 0 ? (
                            <div className="industry-tag-grid">
                                {categories
                                    .filter(cat => cat.name.toLowerCase().includes(industrySearch.toLowerCase()))
                                    .map(cat => {
                                        const selected = formData.industry_ids.includes(cat.id);
                                        return (
                                            <button key={cat.id} type="button"
                                                className={`tag-btn ${selected ? 'active' : ''}`}
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        industry_ids: selected
                                                            ? prev.industry_ids.filter(id => id !== cat.id)
                                                            : [...prev.industry_ids, cat.id],
                                                    }));
                                                }}>
                                                {cat.name}
                                            </button>
                                        );
                                    })}
                                {categories.filter(c => c.name.toLowerCase().includes(industrySearch.toLowerCase())).length === 0 && (
                                    <p className="text-muted small mt-2 mb-0">No industries match "{industrySearch}"</p>
                                )}
                            </div>
                        ) : (
                            <p className="text-muted small mt-2">Loading categories...</p>
                        )}
                        {errors.industry_ids && <p className="field-error-msg mt-2">{errors.industry_ids}</p>}
                    </Form.Group>
                </Col>

                <Col md={12}>
                    <Form.Group>
                        <Form.Label className="form-label">Website URL</Form.Label>
                        <Form.Control type="url" name="website" placeholder="https://yourcompany.com"
                            className="form-control-dark" value={formData.website} onChange={handleInputChange} />
                    </Form.Group>
                </Col>

                <Col md={12}>
                    <div className="social-links-grid mt-2">
                        <h6 className="text-white mb-3 small opacity-75">SOCIAL PROFILES (OPTIONAL)</h6>
                        <Row className="g-3">
                            <Col md={6}>
                                <div className="social-input-wrapper">
                                    <div className="social-icon-box linkedin">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                    </div>
                                    <input type="url" name="linkedin_url" placeholder="LinkedIn URL"
                                        className="form-control-dark social-input" value={formData.linkedin_url} onChange={handleInputChange} />
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="social-input-wrapper">
                                    <div className="social-icon-box twitter">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                                    </div>
                                    <input type="url" name="twitter_url" placeholder="Twitter URL"
                                        className="form-control-dark social-input" value={formData.twitter_url} onChange={handleInputChange} />
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="social-input-wrapper">
                                    <div className="social-icon-box instagram">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                    </div>
                                    <input type="url" name="instagram_url" placeholder="Instagram URL"
                                        className="form-control-dark social-input" value={formData.instagram_url} onChange={handleInputChange} />
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="social-input-wrapper">
                                    <div className="social-icon-box facebook">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" /></svg>
                                    </div>
                                    <input type="url" name="facebook_url" placeholder="Facebook URL"
                                        className="form-control-dark social-input" value={formData.facebook_url} onChange={handleInputChange} />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>

                <Col md={12}>
                    <Form.Group>
                        <Form.Label className="form-label">Startup Logo *</Form.Label>
                        {editMode && formData.existingLogoUrl && !formData.logo && (
                            <div className="mb-2 d-flex align-items-center gap-2">
                                <img src={formData.existingLogoUrl} alt="current logo" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} />
                                <small className="text-muted">Current logo — upload a new file to replace</small>
                            </div>
                        )}
                        <FileUploadBox
                            id="logo-upload" name="logo" accept="image/*"
                            file={formData.logo} onChange={(e) => { handleInputChange(e); clearError('logo'); }}
                            hint="PNG, JPG up to 5MB. 400×400px recommended"
                            icon={
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                            }
                            hasError={!!errors.logo}
                        />
                        {errors.logo && <p className="field-error-msg">{errors.logo}</p>}
                    </Form.Group>
                </Col>

                <Col md={12}>
                    <Form.Group>
                        <Form.Label className="form-label">Startup Banner</Form.Label>
                        <p className="small mb-2">
                            Full-width hero banner displayed on your startup page.
                            You can <strong>drag &amp; zoom</strong> to crop after selecting.
                            Any image works — we'll crop it to 4:1.
                        </p>

                        {editMode && formData.existingBannerUrl && !formData.banner && (
                            <div className="mb-2" style={{
                                borderRadius: 10, overflow: 'hidden',
                                border: '1px solid rgba(255,255,255,0.1)',
                                position: 'relative',
                            }}>
                                <img
                                    src={formData.existingBannerUrl}
                                    alt="current banner"
                                    style={{ width: '100%', aspectRatio: '4/1', objectFit: 'cover', display: 'block' }}
                                />
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    background: 'rgba(0,0,0,0.45)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', background: 'rgba(0,0,0,0.6)', padding: '4px 12px', borderRadius: 6 }}>
                                        Current banner — upload to replace
                                    </span>
                                </div>
                            </div>
                        )}

                        {bannerPreviewUrl && (
                            <div className="mb-2" style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(14,165,233,0.4)' }}>
                                <img
                                    src={bannerPreviewUrl}
                                    alt="banner preview"
                                    style={{ width: '100%', aspectRatio: '4/1', objectFit: 'cover', display: 'block' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCropper(true)}
                                    style={{
                                        position: 'absolute', bottom: 8, right: 8,
                                        background: 'rgba(0,0,0,0.7)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: 8, color: '#fff',
                                        padding: '4px 12px', fontSize: '0.75rem',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                                        backdropFilter: 'blur(4px)',
                                    }}
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2v4h12V2" /><rect x="6" y="10" width="12" height="12" /><path d="M2 6h4v12H2" /></svg>
                                    Re-crop
                                </button>
                            </div>
                        )}

                        <div
                            className="file-upload-box"
                            style={{ cursor: 'pointer', aspectRatio: 'unset', minHeight: 72 }}
                            onClick={() => bannerInputRef.current?.click()}
                        >
                            <div className="upload-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="18" height="14" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                                </svg>
                            </div>
                            <input
                                ref={bannerInputRef}
                                type="file"
                                id="banner-upload"
                                name="banner"
                                className="d-none"
                                accept="image/png,image/jpeg,image/webp,image/jpg"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    if (file.size > 10 * 1024 * 1024) {
                                        alert('Please select an image under 10MB.');
                                        e.target.value = '';
                                        return;
                                    }
                                    const url = URL.createObjectURL(file);
                                    setBannerRawSrc(url);
                                    setShowCropper(true);
                                    e.target.value = '';
                                }}
                            />
                            <p className="upload-text mb-0">
                                {formData.banner
                                    ? <span className="text-success fw-semibold">✓ Banner ready — click to change</span>
                                    : <><span className="text-primary" style={{ cursor: 'pointer' }}>Browse</span> or drag &amp; drop</>}
                            </p>
                            <small className="d-block mt-1">Any image · Crop tool opens after selection · JPG/PNG/WebP up to 10MB</small>
                        </div>
                    </Form.Group>
                </Col>
            </Row>

            <div className="d-flex justify-content-end mt-4">
                <button className="btn-primary-custom" onClick={handleNext}>
                    Continue
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                </button>
            </div>
        </div>
    );

    const handleCropDone = (croppedFile) => {
        setShowCropper(false);
        if (bannerPreviewUrl) URL.revokeObjectURL(bannerPreviewUrl);
        const previewUrl = URL.createObjectURL(croppedFile);
        setBannerPreviewUrl(previewUrl);
        setFormData(prev => ({ ...prev, banner: croppedFile }));
    };

    const handleCropCancel = () => {
        setShowCropper(false);
        if (!formData.banner) setBannerRawSrc(null);
    };

    const StepProduct = () => (
        <div className="startup-form-card">
            <h2 className="section-title">Product &amp; Founders</h2>
            <p className="section-subtitle">Tell us what you're building and who's behind it.</p>

            <Row className="g-4 mb-4">
                <Col md={12}>
                    <Form.Group>
                        <Form.Label className="form-label">Product Description *</Form.Label>
                        <Form.Control as="textarea" name="description" rows={4}
                            placeholder="What does your product do?"
                            className={`form-control-dark textarea-dark ${errors.description ? 'field-error' : ''}`}
                            value={formData.description} onChange={handleInputChange} />
                        {errors.description && <p className="field-error-msg">{errors.description}</p>}
                    </Form.Group>
                </Col>

                <Col md={12}>
                    <h5 className="text-white mt-2 mb-1">Founder(s)</h5>
                    <p className="small mb-3">Add at least one founder. You can add more below.</p>
                </Col>
            </Row>

            {founders.map((founder, index) => (
                <div key={index} className="founder-card mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="text-white mb-0">
                            {index === 0 ? 'Primary Founder' : `Founder ${index + 1}`}
                        </h6>
                        {index > 0 && (
                            <button type="button" className="btn-remove-founder"
                                onClick={() => removeFounder(index)}>
                                ✕ Remove
                            </button>
                        )}
                    </div>

                    <Row className="g-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="form-label">Full Name *</Form.Label>
                                <Form.Control type="text" name="name"
                                    placeholder="e.g. Elon Musk"
                                    className={`form-control-dark ${index === 0 && errors.founderName ? 'field-error' : ''}`}
                                    value={founder.name}
                                    onChange={(e) => { handleFounderChange(index, e); if (index === 0) clearError('founderName'); }} />
                                {index === 0 && errors.founderName && <p className="field-error-msg">{errors.founderName}</p>}
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label className="form-label">Role(s) / Title *</Form.Label>
                                <div className="tags-container">
                                    {ROLE_OPTIONS.map(role => {
                                        const selected = (founder.role || '').split(', ').includes(role);
                                        return (
                                            <button key={role} type="button"
                                                className={`tag-btn small ${selected ? 'active' : ''}`}
                                                onClick={() => toggleFounderRole(index, role)}>
                                                {role}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="mt-2">
                                    <Form.Control
                                        type="text"
                                        name="role"
                                        placeholder="Or type custom role..."
                                        className="form-control-dark mt-2"
                                        value={founder.role}
                                        onChange={(e) => handleFounderChange(index, e)}
                                        style={{ fontSize: '0.85rem' }}
                                    />
                                    <small className="text-muted">Separate multiple roles with commas (e.g. CEO, Founder)</small>
                                </div>
                                {index === 0 && errors.founderRole && <p className="field-error-msg">{errors.founderRole}</p>}
                                {index > 0 && errors[`founderRole_${index}`] && <p className="field-error-msg">{errors[`founderRole_${index}`]}</p>}
                                {index > 0 && errors[`founderName_${index}`] && <p className="field-error-msg">{errors[`founderName_${index}`]}</p>}
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label className="form-label">LinkedIn URL</Form.Label>
                                <Form.Control type="url" name="linkedIn"
                                    placeholder="https://linkedin.com/in/..."
                                    className="form-control-dark"
                                    value={founder.linkedIn}
                                    onChange={(e) => handleFounderChange(index, e)} />
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label className="form-label">Founder Photo</Form.Label>
                                {editMode && founder.existingPhotoUrl && !founder.photo && (
                                    <div className="mb-2 d-flex align-items-center gap-2">
                                        <img src={founder.existingPhotoUrl} alt={founder.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} />
                                        <small className="text-white">Current photo — upload to replace</small>
                                    </div>
                                )}
                                <div className="file-upload-box"
                                    onClick={() => document.getElementById(`founder-photo-${index}`).click()}
                                    style={{ cursor: 'pointer' }}>
                                    <div className="upload-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                                        </svg>
                                    </div>
                                    <input type="file" name="photo" id={`founder-photo-${index}`}
                                        className="d-none" accept="image/*"
                                        onChange={(e) => handleFounderChange(index, e)} />
                                    <p className="upload-text mb-0">
                                        {founder.photo
                                            ? <span className="text-success fw-semibold">✓ {founder.photo.name}</span>
                                            : <><span className="text-primary">Browse</span> or drag &amp; drop</>}
                                    </p>
                                    <small className="d-block mt-1">PNG, JPG up to 5MB</small>
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                </div>
            ))}

            <button type="button" className="btn-add-founder mb-4" onClick={addAnotherFounder}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Another Founder
            </button>

            <div className="d-flex justify-content-between mt-4">
                <button className="btn-back" onClick={handleBack}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                    </svg>
                    Previous
                </button>
                <button className="btn-primary-custom" onClick={handleNext}>
                    Continue
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                </button>
            </div>
        </div>
    );

    const StepSubmit = () => (
        <div className="startup-form-card">
            <h2 className="section-title">Company Info &amp; Submit</h2>
            <p className="section-subtitle">Final details before submitting for review.</p>

            <Row className="g-4 mb-4">
                <Col md={12}>
                    <Form.Group>
                        <Form.Label className="form-label">Funding Stage *</Form.Label>
                        <div className={`tags-container ${errors.stage ? 'tags-error' : ''}`}>
                            {['Pre-seed', 'Seed', 'Series A', 'Series B', 'Bootstrap'].map(stage => (
                                <button key={stage} type="button"
                                    className={`tag-btn ${formData.stage === stage ? 'active' : ''}`}
                                    onClick={() => { setFormData({ ...formData, stage }); clearError('stage'); }}>
                                    {stage}
                                </button>
                            ))}
                        </div>
                        {errors.stage && <p className="field-error-msg">{errors.stage}</p>}
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group>
                        <Form.Label className="form-label">Location</Form.Label>
                        <Form.Control type="text" name="location" placeholder="e.g. San Francisco"
                            className="form-control-dark" value={formData.location} onChange={handleInputChange} />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label className="form-label">Team Size</Form.Label>
                        <Form.Select name="teamSize" className="form-control-dark"
                            value={formData.teamSize} onChange={handleInputChange}>
                            <option value="">Select size</option>
                            <option value="5">1–10</option>
                            <option value="25">11–50</option>
                            <option value="100">51–200</option>
                            <option value="500">200+</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group>
                        <Form.Label className="form-label">Founded Year</Form.Label>
                        <Form.Select name="foundedYear" className="form-control-dark"
                            value={formData.foundedYear} onChange={handleInputChange}>
                            <option value="">Select year</option>
                            {YEAR_OPTIONS.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col md={6}>
                </Col>

                <Col md={12}>
                    <Form.Group>
                        <Form.Label className="form-label">Incorporation Certificate *</Form.Label>
                        <p className="small mb-2">Upload a PDF or image of your incorporation document.</p>
                        {editMode && formData.existingCertUrl && !formData.incorporationCert && (
                            <div className="mb-2 d-flex align-items-center gap-2">
                                <a href={formData.existingCertUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-info py-1 px-2" style={{ fontSize: '0.75rem' }}>
                                    View Current Certificate
                                </a>
                                <small className="text-muted">Upload a new file to replace</small>
                            </div>
                        )}
                        <FileUploadBox
                            id="cert-upload"
                            name="incorporationCert"
                            accept="image/*,application/pdf"
                            file={formData.incorporationCert}
                            onChange={handleInputChange}
                            hint="PDF, PNG, JPG up to 10MB"
                            icon={
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
                                </svg>
                            }
                            hasError={!!errors.incorporationCert}
                        />
                        {errors.incorporationCert && <p className="field-error-msg">{errors.incorporationCert}</p>}
                    </Form.Group>
                </Col>

                <Col md={12}>
                    <Form.Group className="mt-3">
                        <Form.Check
                            type="checkbox" id="terms-check"
                            label="I confirm that all information provided is accurate and I have the authority to submit this startup for review."
                            className="small"
                            checked={formData.termsAccepted}
                            onChange={handleInputChange}
                            name="termsAccepted"
                        />
                    </Form.Group>
                </Col>

                {submitError && (
                    <Col md={12}>
                        <p className="text-danger small mt-2">❌ {submitError}</p>
                    </Col>
                )}
            </Row>

            <div className="d-flex justify-content-between mt-5">
                <button className="btn-back" onClick={handleBack} disabled={submitting}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                    </svg>
                    Previous
                </button>
                <button className="btn-primary-custom" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? (editMode ? 'Saving...' : 'Submitting...') : (editMode ? 'Save Changes' : 'Submit for Review')}
                </button>
            </div>
        </div>
    );

    const StepSuccess = () => (
        <div className="startup-form-card submitted-card">
            <div className="submitted-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
            </div>
            {editMode ? (
                <>
                    <h2 className="section-title mb-3">Changes Saved!</h2>
                    <p className="text-gray-400 mb-4">
                        Your startup has been updated and submitted for re-approval.<br />
                        <strong>Your existing posts remain visible</strong> during review.
                    </p>
                    <div className="d-flex justify-content-center gap-3 mt-4">
                        <button className="btn-primary-custom" onClick={() => navigate('/my-startup')}>Go to My Startup</button>
                    </div>
                </>
            ) : (
                <>
                    <h2 className="section-title mb-3">Submitted!</h2>
                    <p className="text-gray-400 mb-4">
                        Your startup will be reviewed by our editorial team within 3–5 business days. <br />
                        We'll notify you via email once approved.
                    </p>
                    <div className="d-flex justify-content-center mt-4">
                        <Link to="/" className="btn-primary-custom text-decoration-none">Back to Home</Link>
                    </div>
                </>
            )}
        </div>
    );

    if (checkingExisting) {
        return (
            <div className="submit-startup-page d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-3 text-muted">Checking submission status...</p>
                </div>
            </div>
        );
    }

    if (!editMode && existingStartup) {
        const isPending = existingStartup.status === 'PENDING';
        return (
            <div className="submit-startup-page py-5">
                <Container>
                    <div className="form-container">
                        <div className="startup-form-card text-center py-5">
                            <div className="mb-4 d-inline-block p-4 rounded-circle bg-primary bg-opacity-10">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                                </svg>
                            </div>
                            <h2 className="section-title mb-3">
                                {isPending ? 'Startup Submission Under Review' : 'Startup Already Active'}
                            </h2>
                            <p className="text-white mx-auto mb-4" style={{ maxWidth: '450px' }}>
                                Your startup <strong>{existingStartup.name}</strong> is already {isPending ? 'submitted and waiting for approval' : 'active'}.
                                {isPending ? ' Please wait until our team reviews it.' : ' You can update your details through the edit mode or manage it from your dashboard.'}
                            </p>
                            <div className="d-flex justify-content-center gap-3">
                                <Link to="/" className="btn-back text-decoration-none px-4">Back to Home</Link>
                                {!isPending && (
                                    <button onClick={() => navigate('/submit-startup', { state: { editMode: true } })} className="btn-primary-custom px-4 py-2">Edit Startup</button>
                                )}
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <>
            {showCropper && bannerRawSrc && (
                <BannerCropper
                    imageSrc={bannerRawSrc}
                    onCropDone={handleCropDone}
                    onCancel={handleCropCancel}
                />
            )}

            <div className="submit-startup-page">
                <Container>
                    {currentStep < 4 && (
                        <div className="text-center mb-5">
                            <h6 className="text-primary text-uppercase mb-2 small">
                                {editMode ? 'Edit Your Startup' : 'Submit Your Startup'}
                            </h6>
                            <h1 className="display-6 fw-bold mb-3">
                                {editMode ? 'Update Your Startup Details' : 'Get Featured on CommunEdge'}
                            </h1>
                            <p className="text-muted">
                                {editMode
                                    ? 'Changes will go to PENDING for admin approval. Your existing posts stay visible.'
                                    : 'Submissions are reviewed by our editorial team before publishing.'}
                            </p>
                        </div>
                    )}

                    {currentStep < 4 && (
                        <div className="steps-indicator">
                            <div className="steps-progress-line">
                                <div className="steps-progress-fill" style={{ width: `${((currentStep - 1) / 2) * 100}%` }}></div>
                            </div>

                            {[
                                { label: 'Basics', num: 1 },
                                { label: 'Product & Founders', num: 2 },
                                { label: 'Company & Submit', num: 3 },
                            ].map(({ label, num }) => (
                                <div key={num} className={`step-item ${currentStep >= num ? 'active' : ''} ${currentStep > num ? 'completed' : ''}`}>
                                    <div className="step-circle">
                                        {currentStep > num ? (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        ) : (
                                            <span>{num}</span>
                                        )}
                                    </div>
                                    <span className="step-label">{label}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="form-container">
                        {currentStep === 1 && StepBasics()}
                        {currentStep === 2 && StepProduct()}
                        {currentStep === 3 && StepSubmit()}
                        {currentStep === 4 && StepSuccess()}
                    </div>
                </Container>
            </div>
        </>
    );
};

export default SubmitStartup;

