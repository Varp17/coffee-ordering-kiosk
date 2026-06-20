import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LogOut, Coffee, ArrowLeft, Phone, Calendar } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import './ProfilePage.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { isLoggedIn, phone, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully.');
    navigate('/menu');
  };

  if (!isLoggedIn) {
    return (
      <div className="profile-page page-wrapper container profile-not-logged">
        <User size={48} className="profile-icon-muted" />
        <h2>Not Logged In</h2>
        <p>Please log in to view your profile details.</p>
        <button className="btn btn-primary" onClick={() => navigate('/auth')}>
          Log In Now
        </button>
      </div>
    );
  }

  return (
    <div className="profile-page page-wrapper">
      <div className="container profile-container">
        <button className="profile-page__back" onClick={() => navigate('/menu')}>
          <ArrowLeft size={18} /> Back to Menu
        </button>

        <motion.div
          className="profile-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="profile-card__avatar">
            <User size={40} className="avatar-icon" />
          </div>

          <h1 className="profile-card__title">My Account</h1>
          <p className="profile-card__subtitle">Chilld Coffee Regular</p>

          <div className="profile-card__details">
            <div className="detail-row">
              <Phone size={16} />
              <div className="detail-info">
                <span className="detail-label">Mobile Number</span>
                <span className="detail-val">+91 {phone}</span>
              </div>
            </div>
            <div className="detail-row">
              <Calendar size={16} />
              <div className="detail-info">
                <span className="detail-label">Member Since</span>
                <span className="detail-val">June 2026</span>
              </div>
            </div>
            <div className="detail-row">
              <Coffee size={16} />
              <div className="detail-info">
                <span className="detail-label">Favorite Beverage</span>
                <span className="detail-val">Oat Milk Latte</span>
              </div>
            </div>
          </div>

          <button className="btn btn-outline logout-btn" onClick={handleLogout}>
            <LogOut size={16} style={{ marginRight: 8 }} /> Logout
          </button>
        </motion.div>
      </div>
    </div>
  );
}
