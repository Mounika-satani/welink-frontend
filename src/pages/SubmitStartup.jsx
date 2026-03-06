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

const emptyFounder = () => ({ name: '', role: '', linkedIn: '', photo: null });

const SubmitStartup = () => {
    const { user, token } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const editMode = location.state?.editMode === true;

    const [currentStep, setCurrentStep] = useState(1);
    const [categories, setCategories] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [startupId, setStartupId] = useState(null);

    const [bannerRawSrc, setBannerRawSrc] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const [bannerPreviewUrl, setBannerPreviewUrl] = useState(null);
    const bannerInputRef = useRef();

    const [formData, setFormData] = useState({
        startupName: '',
        tagline: '',
        industry_id: '',
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
    });

    const [founders, setFounders] = useState([emptyFounder()]);

    useEffect(() => {
        getCategories()
            .then(setCategories)
            .catch(() => setCategories([]));
    }, []);

    useEffect(() => {
        if (!editMode || !token) return;
        getMyStartup(token).then(s => {
            setStartupId(s.id);
            setFormData(prev => ({
                ...prev,
                startupName: s.name || '',
                tagline: s.tagline || '',
                industry_id: s.industry_id || '',
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

    const addAnotherFounder = () => setFounders(prev => [...prev, emptyFounder()]);

    const removeFounder = (index) =>
        setFounders(prev => prev.filter((_, i) => i !== index));

    const handleNext = () => {
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
        if (!editMode && !formData.termsAccepted) {
            setSubmitError('Please accept the terms to continue.');
            return;
        }
        setSubmitting(true);
        setSubmitError('');

        try {
            if (editMode && startupId) {
                await updateStartup(token, startupId, {
                    name: formData.startupName,
                    tagline: formData.tagline,
                    description: formData.description,
                    industry_id: formData.industry_id,
                    website_url: formData.website,
                    funding_stage: formData.stage,
                    location: formData.location,
                    team_size: formData.teamSize,
                    founded_year: formData.foundedYear,
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
                if (formData.logo) fd.append('logo', formData.logo);
                if (formData.banner) fd.append('banner', formData.banner);
                if (formData.incorporationCert) fd.append('incorporation_certificate', formData.incorporationCert);
                fd.append('name', formData.startupName);
                fd.append('tagline', formData.tagline);
                fd.append('description', formData.description);
                if (formData.industry_id) fd.append('industry_id', formData.industry_id);
                if (formData.website) fd.append('website_url', formData.website);
                if (formData.stage) fd.append('funding_stage', formData.stage);
                if (formData.location) fd.append('location', formData.location);
                if (formData.teamSize) fd.append('team_size', formData.teamSize);
                if (formData.foundedYear) fd.append('founded_year', formData.foundedYear);

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
            {hint && <small className="text-muted d-block mt-1">{hint}</small>}
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
                            className="form-control-dark" value={formData.startupName} onChange={handleInputChange} />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label className="form-label">Tagline *</Form.Label>
                        <Form.Control type="text" name="tagline" placeholder="e.g. AI for Supply Chain"
                            className="form-control-dark" value={formData.tagline} onChange={handleInputChange} />
                    </Form.Group>
                </Col>

                <Col md={12}>
                    <Form.Group>
                        <Form.Label className="form-label">Industry *</Form.Label>
                        {categories.length > 0 ? (
                            <div className="tags-container">
                                {categories.map(cat => (
                                    <button key={cat.id} type="button"
                                        className={`tag-btn ${formData.industry_id === cat.id ? 'active' : ''}`}
                                        onClick={() => setFormData({ ...formData, industry_id: cat.id })}>
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <Form.Select name="industry_id" className="form-control-dark"
                                value={formData.industry_id} onChange={handleInputChange}>
                                <option value="">Loading categories...</option>
                            </Form.Select>
                        )}
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
                    <Form.Group>
                        <Form.Label className="form-label">Startup Logo</Form.Label>
                        {editMode && formData.existingLogoUrl && !formData.logo && (
                            <div className="mb-2 d-flex align-items-center gap-2">
                                <img src={formData.existingLogoUrl} alt="current logo" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} />
                                <small className="text-muted">Current logo — upload a new file to replace</small>
                            </div>
                        )}
                        <FileUploadBox
                            id="logo-upload" name="logo" accept="image/*"
                            file={formData.logo} onChange={handleInputChange}
                            hint="PNG, JPG up to 5MB. 400×400px recommended"
                            icon={
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                            }
                        />
                    </Form.Group>
                </Col>

                <Col md={12}>
                    <Form.Group>
                        <Form.Label className="form-label">Startup Banner</Form.Label>
                        <p className="text-muted small mb-2">
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
                            <small className="text-muted d-block mt-1">Any image · Crop tool opens after selection · JPG/PNG/WebP up to 10MB</small>
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
                            className="form-control-dark textarea-dark"
                            value={formData.description} onChange={handleInputChange} />
                    </Form.Group>
                </Col>

                <Col md={12}>
                    <h5 className="text-white mt-2 mb-1">Founder(s)</h5>
                    <p className="text-muted small mb-3">Add at least one founder. You can add more below.</p>
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
                                    className="form-control-dark"
                                    value={founder.name}
                                    onChange={(e) => handleFounderChange(index, e)} />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="form-label">Role / Title</Form.Label>
                                <Form.Select name="role" className="form-control-dark"
                                    value={founder.role}
                                    onChange={(e) => handleFounderChange(index, e)}>
                                    <option value="">Select role</option>
                                    <option value="CEO">CEO</option>
                                    <option value="CTO">CTO</option>
                                    <option value="Co-Founder">Co-Founder</option>
                                    <option value="CMO">CMO</option>
                                    <option value="CFO">CFO</option>
                                    <option value="COO">COO</option>
                                    <option value="Founder">Founder</option>
                                </Form.Select>
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
                                        <small className="text-muted">Current photo — upload to replace</small>
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
                                    <small className="text-muted d-block mt-1">PNG, JPG up to 5MB</small>
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
                <button className="btn-back" onClick={handleBack}>← Previous</button>
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
                        <div className="tags-container">
                            {['Pre-seed', 'Seed', 'Series A', 'Series B', 'Bootstrap'].map(stage => (
                                <button key={stage} type="button"
                                    className={`tag-btn ${formData.stage === stage ? 'active' : ''}`}
                                    onClick={() => setFormData({ ...formData, stage })}>
                                    {stage}
                                </button>
                            ))}
                        </div>
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
                        <Form.Label className="form-label">Incorporation Certificate</Form.Label>
                        <p className="text-muted small mb-2">Optional — upload a PDF or image of your incorporation document.</p>
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
                        />
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
                <button className="btn-back" onClick={handleBack} disabled={submitting}>← Previous</button>
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
                                {editMode ? 'Update Your Startup Details' : 'Get Featured on WeLink'}
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

