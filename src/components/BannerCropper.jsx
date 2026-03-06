import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

const createImage = (url) =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener('load', () => resolve(img));
        img.addEventListener('error', reject);
        img.setAttribute('crossOrigin', 'anonymous');
        img.src = url;
    });

export const getCroppedBlob = async (imageSrc, croppedAreaPixels, filename = 'banner.jpg') => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            if (!blob) { resolve(null); return; }
            const file = new File([blob], filename, { type: 'image/jpeg' });
            resolve(file);
        }, 'image/jpeg', 0.92);
    });
};

const BannerCropper = ({ imageSrc, onCancel, onCropDone }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [loading, setLoading] = useState(false);

    const onCropComplete = useCallback((_, pixels) => {
        setCroppedAreaPixels(pixels);
    }, []);

    const handleDone = async () => {
        setLoading(true);
        try {
            const file = await getCroppedBlob(imageSrc, croppedAreaPixels);
            onCropDone(file);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
        }}>
            <div style={{
                width: '100%', maxWidth: 900,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 20px 16px',
            }}>
                <div>
                    <h5 style={{ color: '#fff', margin: 0, fontWeight: 700 }}>Crop Banner</h5>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', margin: 0 }}>
                        Drag to reposition · Scroll/pinch to zoom · Fixed 4:1 ratio
                    </p>
                </div>
                <button onClick={onCancel} style={{
                    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 8, color: '#fff', padding: '6px 14px', cursor: 'pointer', fontSize: '0.85rem',
                }}>
                    Cancel
                </button>
            </div>

            <div style={{
                position: 'relative',
                width: '90vw', maxWidth: 900,
                height: 'calc(90vw / 4)', maxHeight: 225,
                borderRadius: 12, overflow: 'hidden',
                border: '2px solid rgba(14,165,233,0.5)',
                background: '#000',
            }}>
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={4 / 1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    style={{
                        containerStyle: { borderRadius: 10 },
                        cropAreaStyle: {
                            border: '2px solid rgba(14,165,233,0.9)',
                            boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
                        },
                    }}
                />
            </div>

            <div style={{
                display: 'flex', alignItems: 'center', gap: 14,
                marginTop: 20, width: '90vw', maxWidth: 900, padding: '0 4px',
            }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                <input
                    type="range" min={1} max={3} step={0.05}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    style={{ flex: 1, accentColor: '#0ea5e9', cursor: 'pointer' }}
                />
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button
                    onClick={onCancel}
                    style={{
                        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: 10, color: 'rgba(255,255,255,0.7)', padding: '10px 28px',
                        cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
                    }}
                >
                    Cancel
                </button>
                <button
                    onClick={handleDone}
                    disabled={loading || !croppedAreaPixels}
                    style={{
                        background: loading ? 'rgba(14,165,233,0.4)' : '#0ea5e9',
                        border: 'none', borderRadius: 10,
                        color: '#fff', padding: '10px 32px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '0.9rem', fontWeight: 700,
                        transition: 'background 0.2s',
                        display: 'flex', alignItems: 'center', gap: 8,
                    }}
                >
                    {loading ? (
                        <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                            Processing…
                        </>
                    ) : (
                        <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                            Use this crop
                        </>
                    )}
                </button>
            </div>

            <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
        </div>
    );
};

export default BannerCropper;
