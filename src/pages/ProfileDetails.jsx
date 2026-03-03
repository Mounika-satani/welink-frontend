import { useEffect, useRef, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile, deleteUserProfilePhoto } from '../service/user';
import './ProfileDetails.css';

const ProfileDetails = () => {
    const { user, dbUser, token } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [imgError, setImgError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadMsg, setUploadMsg] = useState('');
    const [deleting, setDeleting] = useState(false);
    const fileInputRef = useRef(null);

    const fetchProfile = async () => {
        if (!user?.uid) return;
        try {
            setLoading(true);
            const data = await getUserProfile(user.uid, token);
            setProfile(data);
            setImgError(false);
        } catch (err) {
            setError(err.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [user?.uid]);

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setUploadMsg('❌ Only image files are allowed.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setUploadMsg('❌ Image must be under 5MB.');
            return;
        }

        try {
            setUploading(true);
            setUploadMsg('');
            await updateUserProfile(user.uid, token, {}, file);
            setUploadMsg('✅ Photo updated!');
            await fetchProfile();
        } catch (err) {
            console.error('Upload error:', err);
            setUploadMsg(`❌ ${err.message || 'Upload failed'}`);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDeletePhoto = async () => {
        if (!photoUrl || deleting) return;
        try {
            setDeleting(true);
            setUploadMsg('');
            await deleteUserProfilePhoto(user.uid, token);
            setUploadMsg('Photo removed.');
            setImgError(false);
            await fetchProfile();
        } catch (err) {
            setUploadMsg(`❌ ${err.message || 'Remove failed'}`);
        } finally {
            setDeleting(false);
        }
    };

    const displayName = user?.displayName || profile?.email?.split('@')[0] || 'User';
    const photoUrl = imgError ? null : (profile?.photo_url || dbUser?.photo_url || null);
    const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-IN', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="profile-page">
                <div className="profile-loading">
                    <div className="profile-spinner" />
                    <span>Loading your profile...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-page">
                <div className="profile-error">
                    <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#f87171" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v4m0 4h.01" strokeLinecap="round" />
                    </svg>
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <Container>
                <Row className="justify-content-center">

                    <Col lg={4} md={5} className="mb-4">
                        <div className="profile-card">

                            <input
                                ref={fileInputRef}
                                type="file"
                                id="photo-upload-input"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />

                            {/* Avatar — plain, no click handler */}
                            <div className="profile-avatar-wrapper">
                                {photoUrl ? (
                                    <img
                                        src={photoUrl}
                                        alt={displayName}
                                        className="profile-avatar"
                                        onError={() => setImgError(true)}
                                    />
                                ) : (
                                    <div className="profile-avatar-fallback">{initials}</div>
                                )}
                            </div>

                            {/* Upload/Remove buttons below the avatar */}
                            <div className="profile-photo-actions">
                                <button
                                    className="profile-photo-btn"
                                    title="Upload new photo"
                                    disabled={uploading}
                                    onClick={() => !uploading && fileInputRef.current?.click()}
                                >
                                    {uploading ? (
                                        <div className="profile-upload-spinner" />
                                    ) : (
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="17 8 12 3 7 8" />
                                            <line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                    )}
                                    <span>{uploading ? 'Uploading…' : 'Upload'}</span>
                                </button>

                                {photoUrl && (
                                    <button
                                        className="profile-photo-btn profile-photo-btn--remove"
                                        title="Remove photo"
                                        disabled={deleting}
                                        onClick={handleDeletePhoto}
                                    >
                                        {deleting ? (
                                            <div className="profile-upload-spinner" />
                                        ) : (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        )}
                                        <span>{deleting ? 'Removing…' : 'Remove'}</span>
                                    </button>
                                )}
                            </div>

                            {uploadMsg && <p className="profile-upload-msg">{uploadMsg}</p>}
                            <h1 className="profile-name">{displayName}</h1>
                            <hr className="profile-divider" />


                            <div className="profile-info-row">
                                <span className="profile-info-label">Provider</span>
                                <span className="profile-info-value">
                                    {profile?.auth_provider === 'google.com' ? '🔵 Google' : profile?.auth_provider || '—'}
                                </span>
                            </div>


                        </div>
                    </Col>

                    <Col lg={7} md={7} className="mb-4">

                        <div className="profile-card mb-4" style={{ textAlign: 'left' }}>
                            <p className="profile-section-title">Account Details</p>
                            <div className="profile-info-row">
                                <span className="profile-info-label">Email</span>
                                <span className="profile-info-value">{profile?.email}</span>
                            </div>
                            <div className="profile-info-row">
                                <span className="profile-info-label">Role</span>
                                <span className="profile-info-value profile-gradient-text">{profile?.role}</span>
                            </div>
                            <div className="profile-info-row">
                                <span className="profile-info-label">Status</span>
                                <span className={`profile-info-value ${profile?.is_active ? 'text-success' : 'text-danger'}`}>
                                    {profile?.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>

                        <div className="profile-card" style={{ textAlign: 'left' }}>
                            <p className="profile-section-title">Startup</p>

                            {profile?.startup ? (
                                <Link to="/my-startup" className="profile-startup-card">
                                    <div className="profile-startup-icon">🚀</div>
                                    <div>
                                        <div className="profile-startup-name">{profile.startup.name}</div>
                                        <div className="profile-startup-sub">
                                            {profile.startup.tagline || profile.startup.category || 'View details →'}
                                        </div>
                                    </div>
                                </Link>
                            ) : (
                                <div className="profile-no-startup">
                                    <p style={{ marginBottom: '0.8rem' }}>You haven't submitted a startup yet.</p>
                                    <Link
                                        to="/submit-startup"
                                        className="profile-edit-btn"
                                        style={{ textDecoration: 'none', display: 'inline-block' }}
                                    >
                                        + Submit Your Startup
                                    </Link>
                                </div>
                            )}
                        </div>

                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ProfileDetails;