
import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { createPost } from '../service/post';
import { getMyStartup } from '../service/startup';
import './CreatePostModal.css';

const CreatePostModal = ({ show, onHide }) => {
    const { token, dbUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [startupLoading, setStartupLoading] = useState(false);
    const [error, setError] = useState(null);
    const [startupId, setStartupId] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        post_type: 'UPDATE',
        media_type: 'IMAGE',
        demo_link: '',
        external_link: '',
        comments_enabled: true
    });

    // Multiple media files + their previews
    const [mediaFiles, setMediaFiles] = useState([]);     // File[]
    const [mediaPreviews, setMediaPreviews] = useState([]); // { url, type }[]
    const [activePreview, setActivePreview] = useState(0);

    const [thumbnail, setThumbnail] = useState(null);
    const fileInputRef = useRef();

    useEffect(() => {
        if (show && dbUser && !startupId) {
            const fetchStartup = async () => {
                try {
                    setStartupLoading(true);
                    const startup = await getMyStartup(token);
                    if (startup) setStartupId(startup.id);
                } catch (err) {
                    console.error('Failed to load startup details:', err);
                    setError('Could not find your startup profile. Please ensure you have submitted one.');
                } finally {
                    setStartupLoading(false);
                }
            };
            fetchStartup();
        }
    }, [show, dbUser, token]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleMediaFiles = (e) => {
        const selected = Array.from(e.target.files);
        if (!selected.length) return;

        // Cap at 10
        const combined = [...mediaFiles, ...selected].slice(0, 10);
        setMediaFiles(combined);

        // Build previews
        const buildPreviews = combined.map(file => new Promise(resolve => {
            const reader = new FileReader();
            reader.onloadend = () => resolve({ url: reader.result, type: file.type });
            reader.readAsDataURL(file);
        }));

        Promise.all(buildPreviews).then(previews => {
            setMediaPreviews(previews);
            setActivePreview(0);
            // Detect type from first file
            const firstType = combined[0].type.startsWith('video') ? 'VIDEO' : 'IMAGE';
            setFormData(prev => ({ ...prev, media_type: firstType }));
        });
    };

    const removeMedia = (idx) => {
        const newFiles = mediaFiles.filter((_, i) => i !== idx);
        const newPreviews = mediaPreviews.filter((_, i) => i !== idx);
        setMediaFiles(newFiles);
        setMediaPreviews(newPreviews);
        setActivePreview(Math.min(activePreview, newFiles.length - 1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!startupId) { setError('Startup profile not found.'); return; }

        try {
            setLoading(true);
            setError(null);

            const data = new FormData();
            Object.entries(formData).forEach(([key, val]) => {
                if (val) data.append(key, val);
            });
            data.append('startup_id', startupId);

            // Append all media files under the same field name "media"
            mediaFiles.forEach(file => data.append('media', file));
            if (thumbnail) data.append('thumbnail', thumbnail);
            data.append('comments_enabled', formData.comments_enabled ? 'true' : 'false');

            await createPost(token, data);
            setSuccess(true);
            setTimeout(() => {
                onHide();
                setSuccess(false);
                setFormData({ title: '', content: '', post_type: 'UPDATE', media_type: 'IMAGE', demo_link: '', external_link: '', comments_enabled: true });
                setMediaFiles([]);
                setMediaPreviews([]);
                setThumbnail(null);
            }, 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const current = mediaPreviews[activePreview];

    return (
        <Modal show={show} onHide={onHide} centered className="create-post-modal" size="lg">
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold">Upload Media &amp; Showcase</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {success ? (
                    <Alert variant="success" className="text-center py-4">
                        <h4>Success!</h4>
                        <p className="mb-0">Your showcase has been uploaded successfully.</p>
                    </Alert>
                ) : (
                    <Form onSubmit={handleSubmit}>
                        {error && <Alert variant="danger">{error}</Alert>}

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small">Post Title</Form.Label>
                                    <Form.Control type="text" name="title" placeholder="Enter a catchy title..."
                                        value={formData.title} onChange={handleChange} required />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="small">Post Type</Form.Label>
                                    <Form.Select name="post_type" value={formData.post_type} onChange={handleChange}>
                                        <option value="UPDATE">Standard Update</option>
                                        <option value="MILESTONE">Milestone / Achievement</option>
                                        <option value="PRODUCT_DEMO">Product Showcase / Demo</option>
                                        <option value="NEWS">News / Press Release</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="small">Content / Description</Form.Label>
                                    <Form.Control as="textarea" rows={4} name="content"
                                        placeholder="Explain your showcase..." value={formData.content} onChange={handleChange} />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                {/* ── Media Upload Area ── */}
                                <Form.Group className="mb-3">
                                    <Form.Label className="small d-flex justify-content-between">
                                        <span>Upload Media (Image or Video)</span>
                                        <span style={{ color: '#888' }}>{mediaFiles.length}/10 files</span>
                                    </Form.Label>

                                    {/* Main preview / drop zone */}
                                    <div className="upload-area" onClick={() => fileInputRef.current.click()}>
                                        {current ? (
                                            <div className="preview-container">
                                                {current.type.startsWith('video') ? (
                                                    <video src={current.url} className="preview-img" muted />
                                                ) : (
                                                    <img src={current.url} alt="Preview" className="preview-img" />
                                                )}
                                                {/* Slide counter badge */}
                                                {mediaPreviews.length > 1 && (
                                                    <div className="media-slide-badge">{activePreview + 1} / {mediaPreviews.length}</div>
                                                )}
                                                <button type="button" className="remove-btn"
                                                    onClick={e => { e.stopPropagation(); removeMedia(activePreview); }}>×</button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="upload-icon">
                                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                                        <polyline points="21 15 16 10 5 21" />
                                                    </svg>
                                                </div>
                                                <p className="mb-1">Click to upload photos or videos</p>
                                                <span className="small text-muted">Up to 10 files · Max 50MB each</span>
                                            </>
                                        )}
                                    </div>

                                    <input
                                        type="file"
                                        className="d-none"
                                        ref={fileInputRef}
                                        accept="image/*,video/*"
                                        multiple
                                        onChange={handleMediaFiles}
                                    />

                                    {/* Thumbnail strip — shown from the first file onwards */}
                                    {mediaPreviews.length > 0 && (
                                        <div className="media-thumb-strip">
                                            {mediaPreviews.map((p, i) => (
                                                <div
                                                    key={i}
                                                    className={`media-thumb ${i === activePreview ? 'active' : ''}`}
                                                    onClick={() => setActivePreview(i)}
                                                >
                                                    {p.type.startsWith('video') ? (
                                                        <video src={p.url} muted />
                                                    ) : (
                                                        <img src={p.url} alt={`Slide ${i + 1}`} />
                                                    )}
                                                    <button
                                                        type="button"
                                                        className="thumb-remove"
                                                        onClick={e => { e.stopPropagation(); removeMedia(i); }}
                                                    >×</button>
                                                </div>
                                            ))}
                                            {mediaFiles.length < 10 && (
                                                <div className="media-thumb add-more" onClick={() => fileInputRef.current.click()}>
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
                                                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="small">Links (Optional)</Form.Label>
                                    <Form.Control type="url" name="demo_link" placeholder="Live Demo URL (Loom, YouTube, etc.)"
                                        className="mb-2" value={formData.demo_link} onChange={handleChange} />
                                    <Form.Control type="url" name="external_link" placeholder="Press Link / External URL"
                                        value={formData.external_link} onChange={handleChange} />
                                </Form.Group>

                                {/* ── Comments Toggle ── */}
                                <div className="comments-toggle-row">
                                    <div className="comments-toggle-info">
                                        <span className="comments-toggle-icon">
                                            {formData.comments_enabled ? (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                                </svg>
                                            ) : (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                                    <line x1="2" y1="2" x2="22" y2="22" />
                                                </svg>
                                            )}
                                        </span>
                                        <div>
                                            <p className="comments-toggle-label">Comments</p>
                                            <p className="comments-toggle-desc">
                                                {formData.comments_enabled
                                                    ? 'Viewers can comment on this post'
                                                    : 'Comments are turned off for this post'}
                                            </p>
                                        </div>
                                    </div>
                                    <label className="toggle-switch" htmlFor="comments-toggle">
                                        <input
                                            type="checkbox"
                                            id="comments-toggle"
                                            name="comments_enabled"
                                            checked={formData.comments_enabled}
                                            onChange={handleChange}
                                        />
                                        <span className="toggle-slider" />
                                    </label>
                                </div>

                                <Button className="btn-publish" type="submit" disabled={loading || startupLoading}>
                                    {loading ? <><Spinner animation="border" size="sm" className="me-2" />Publishing...</> : 'Publish to Profile'}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default CreatePostModal;
