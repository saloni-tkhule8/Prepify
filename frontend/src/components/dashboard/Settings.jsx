import { useState, useEffect, useRef } from 'react';
import { getProfile, updateName, updateProfileImage, deleteAccount } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import './Settings.css';
import defaultAvatar from '../../assets/userProfile.png';

// ── Section Card ──────────────────────────────────────────
const Section = ({ title, subtitle, children }) => (
  <div className="settings-section">
    <div className="settings-section-header">
      <h2 className="settings-section-title">{title}</h2>
      {subtitle && <p className="settings-section-sub">{subtitle}</p>}
    </div>
    {children}
  </div>
);

// ── Root ──────────────────────────────────────────────────
const Settings = () => {
  const navigate  = useNavigate();
  const fileRef   = useRef();
  const token     = localStorage.getItem('token');

  const [user,       setUser]       = useState(null);
  const [imgSrc,     setImgSrc]     = useState(defaultAvatar);
  const [nameVal,    setNameVal]    = useState('');
  const [nameLoading, setNameLoading] = useState(false);
  const [nameMsg,    setNameMsg]    = useState({ text: '', error: false });
  const [imgLoading, setImgLoading] = useState(false);
  const [imgMsg,     setImgMsg]     = useState({ text: '', error: false });
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteMsg,  setDeleteMsg]  = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getProfile(token);
        if (res.success) {
          setUser(res.user);
          setNameVal(res.user.name || '');
          setImgSrc(res.user.profileImage?.url || defaultAvatar);
        }
      } catch {}
    };
    load();
  }, []);

  // ── Update Name ──
  const handleNameSave = async () => {
    if (!nameVal.trim()) return setNameMsg({ text: 'Name cannot be empty.', error: true });
    setNameLoading(true); setNameMsg({ text: '', error: false });
    try {
      const res = await updateName(nameVal.trim(), token);
      if (res.success) {
        setUser(res.user);
        setNameMsg({ text: 'Name updated successfully.', error: false });
      } else {
        setNameMsg({ text: res.message || 'Failed to update name.', error: true });
      }
    } catch {
      setNameMsg({ text: 'Something went wrong.', error: true });
    } finally {
      setNameLoading(false);
    }
  };

  // ── Update Profile Image ──
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgLoading(true); setImgMsg({ text: '', error: false });
    try {
      const res = await updateProfileImage(file, token);
      if (res.success) {
        setImgSrc(res.user.profileImage?.url || defaultAvatar);
        setUser(res.user);
        setImgMsg({ text: 'Profile picture updated.', error: false });
      } else {
        setImgMsg({ text: res.message || 'Upload failed.', error: true });
      }
    } catch {
      setImgMsg({ text: 'Upload failed.', error: true });
    } finally {
      setImgLoading(false);
      e.target.value = '';
    }
  };

  // ── Delete Account ──
  const handleDelete = async () => {
    setDeleteLoading(true); setDeleteMsg('');
    try {
      const res = await deleteAccount(token);
      if (res.success) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setDeleteMsg(res.message || 'Failed to delete account.');
      }
    } catch {
      setDeleteMsg('Something went wrong.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your profile and account</p>
      </div>

      {/* ── Profile Picture ── */}
      <Section title="Profile Picture" subtitle="Upload a new profile photo. Max 2MB, JPG/PNG/WEBP.">
        <div className="settings-avatar-row">
          <div className="settings-avatar-wrap">
            <img
              src={imgSrc}
              alt="avatar"
              className="settings-avatar"
              onError={() => setImgSrc(defaultAvatar)}
            />
            {imgLoading && <div className="settings-avatar-overlay"><span className="spinner" /></div>}
          </div>
          <div className="settings-avatar-actions">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            <button
              className="settings-btn settings-btn-primary"
              onClick={() => fileRef.current.click()}
              disabled={imgLoading}
            >
              {imgLoading ? <><span className="spinner" /> Uploading...</> : 'Change Photo'}
            </button>
            {imgMsg.text && (
              <p className={imgMsg.error ? 'settings-msg settings-msg-error' : 'settings-msg settings-msg-success'}>
                {imgMsg.text}
              </p>
            )}
          </div>
        </div>
      </Section>

      {/* ── Update Name ── */}
      <Section title="Display Name" subtitle="This name will appear across your dashboard.">
        <div className="settings-field-row">
          <input
            className="settings-input"
            type="text"
            value={nameVal}
            onChange={(e) => setNameVal(e.target.value)}
            placeholder="Your name"
            onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
          />
          <button
            className="settings-btn settings-btn-primary"
            onClick={handleNameSave}
            disabled={nameLoading}
          >
            {nameLoading ? <><span className="spinner" /> Saving...</> : 'Save'}
          </button>
        </div>
        {nameMsg.text && (
          <p className={nameMsg.error ? 'settings-msg settings-msg-error' : 'settings-msg settings-msg-success'}>
            {nameMsg.text}
          </p>
        )}
      </Section>

      {/* ── Account Info (read-only) ── */}
      <Section title="Account" subtitle="Your account details.">
        <div className="settings-info-row">
          <span className="settings-info-label">Email</span>
          <span className="settings-info-value">{user?.email || '—'}</span>
        </div>
      </Section>

      {/* ── Danger Zone ── */}
      <Section title="Danger Zone" subtitle="Permanent actions that cannot be undone.">
        <div className="settings-danger-box">
          <div className="settings-danger-text">
            <p className="settings-danger-title">Delete Account</p>
            <p className="settings-danger-sub">All your data, sessions, and profile will be permanently removed.</p>
          </div>
          {!deleteConfirm ? (
            <button className="settings-btn settings-btn-danger" onClick={() => setDeleteConfirm(true)}>
              Delete Account
            </button>
          ) : (
            <div className="settings-confirm-row">
              <p className="settings-confirm-text">Are you sure? This cannot be undone.</p>
              <div className="settings-confirm-btns">
                <button className="settings-btn settings-btn-ghost" onClick={() => setDeleteConfirm(false)}>
                  Cancel
                </button>
                <button className="settings-btn settings-btn-danger" onClick={handleDelete} disabled={deleteLoading}>
                  {deleteLoading ? <><span className="spinner" /> Deleting...</> : 'Yes, Delete'}
                </button>
              </div>
            </div>
          )}
          {deleteMsg && <p className="settings-msg settings-msg-error">{deleteMsg}</p>}
        </div>
      </Section>
    </div>
  );
};

export default Settings;
