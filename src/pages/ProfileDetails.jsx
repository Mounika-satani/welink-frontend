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

                    <Col lg={7} md={9}>
                        <div className="profile-card profile-card--single-column">
                            <input
                                ref={fileInputRef}
                                type="file"
                                id="photo-upload-input"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />

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
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="17 8 12 3 7 8" />
                                            <line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                    )}
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
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        )}
                                    </button>
                                )}
                            </div>

                            {uploadMsg && <p className="profile-upload-msg">{uploadMsg}</p>}
                            <h1 className="profile-name">{displayName}</h1>

                            <hr className="profile-divider" />

                            <div className="profile-details-section">
                                <p className="profile-section-title">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                    Account Details
                                </p>
                                <div className="profile-info-row">
                                    <span className="profile-info-label">Email Address</span>
                                    <span className="profile-info-value">{profile?.email}</span>
                                </div>
                                <div className="profile-info-row">
                                    <span className="profile-info-label">Platform Role</span>
                                    <span className="profile-info-value profile-gradient-text" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>{profile?.role}</span>
                                </div>
                                <div className="profile-info-row">
                                    <span className="profile-info-label">Account Status</span>
                                    <span className={`profile-info-value ${profile?.is_active ? 'text-success' : 'text-danger'}`}>
                                        {profile?.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ProfileDetails;