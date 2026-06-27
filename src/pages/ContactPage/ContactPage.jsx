import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, MapPin, Mail, Clock, PhoneCall, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import './ContactPage.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    if (!formData.message.trim()) {
      toast.error('Please type in your message');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success('Message sent successfully! ☕');
    }, 1500);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'general',
      message: '',
    });
    setSubmitted(false);
  };

  return (
    <main className="contact-landing-page">
      {/* ── HERO BANNER ── */}
      <section className="contact-hero">
        <div className="contact-hero__graffiti" aria-hidden="true" />
        <div className="container contact-hero__content">
          <p className="contact-hero__eyebrow">CHILLD SUPPORT LAB</p>
          <h1 className="contact-hero__title">Get In Touch</h1>
          <p className="contact-hero__desc">
            We are here to help. Reach out to our team for order help, partnerships, or feed us some feedback.
          </p>
        </div>
        {/* Wavy Divider Transition */}
        <div className="hero-wave-divider">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
            <path 
              d="M0,96 C360,120 720,40 1440,80 L1440,120 L0,120 Z" 
              fill="var(--color-background-alt, #f5f9fc)" 
            />
          </svg>
        </div>
      </section>

      {/* ── SPLIT MAIN CONTENT ── */}
      <section className="contact-split-section">
        <div className="container contact-split-grid">
          
          {/* Left Column: Contact Channels Info */}
          <motion.div 
            className="contact-info-block"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="info-badge">
              <MessageCircle size={14} />
              <span>Contact Directory</span>
            </div>

            <h2>Chilld Coffee Headquarters</h2>
            <p className="info-intro">
              Drop by or connect via our direct communication channels. We aim to respond to all inquiries within 24 hours.
            </p>

            <div className="channel-list">
              {/* Address */}
              <div className="channel-item">
                <div className="channel-icon-box">
                  <MapPin size={20} />
                </div>
                <div className="channel-details">
                  <h3>Our Location</h3>
                  <p>Plot No. 44, Industrial Area Phase II, Bengaluru, Karnataka, 560001</p>
                </div>
              </div>

              {/* Email */}
              <div className="channel-item">
                <div className="channel-icon-box">
                  <Mail size={20} />
                </div>
                <div className="channel-details">
                  <h3>Direct Support</h3>
                  <p><a href="mailto:support@chilldcoffee.com">support@chilldcoffee.com</a></p>
                  <p><a href="mailto:partners@chilldcoffee.com">partners@chilldcoffee.com</a></p>
                </div>
              </div>

              {/* Phone */}
              <div className="channel-item">
                <div className="channel-icon-box">
                  <PhoneCall size={20} />
                </div>
                <div className="channel-details">
                  <h3>Call Support</h3>
                  <p>+91 (80) 4567-8910</p>
                  <p>Mon - Sat, 9:00 AM - 6:00 PM</p>
                </div>
              </div>

              {/* Hours */}
              <div className="channel-item">
                <div className="channel-icon-box">
                  <Clock size={20} />
                </div>
                <div className="channel-details">
                  <h3>Operational Hours</h3>
                  <p>Kiosk Orders: 24/7</p>
                  <p>Customer Care: 9:00 AM - 8:00 PM IST</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Premium Contact Form */}
          <motion.div 
            className="contact-card"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {!submitted ? (
              <form className="contact-form" onSubmit={handleSubmit}>
                <h2 className="form-title">Send a Message</h2>
                
                {/* Name */}
                <div className="form-group">
                  <label htmlFor="contact-name" className="form-label">Full Name</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      className="form-input"
                      placeholder="e.g. Jane Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="contact-email" className="form-label">Email Address</label>
                  <div className="input-wrapper">
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      className="form-input"
                      placeholder="e.g. jane@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label htmlFor="contact-phone" className="form-label">Phone Number (Optional)</label>
                  <div className="input-wrapper">
                    <input
                      type="tel"
                      id="contact-phone"
                      name="phone"
                      className="form-input"
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="form-group">
                  <label htmlFor="contact-subject" className="form-label">Subject</label>
                  <div className="input-wrapper">
                    <select
                      id="contact-subject"
                      name="subject"
                      className="form-select"
                      value={formData.subject}
                      onChange={handleChange}
                    >
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Support & Issues</option>
                      <option value="b2b">B2B / Partnership</option>
                      <option value="feedback">Feedback & Suggestions</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="form-group">
                  <label htmlFor="contact-message" className="form-label">Message</label>
                  <div className="input-wrapper">
                    <textarea
                      id="contact-message"
                      name="message"
                      className="form-textarea"
                      placeholder="Type your message here..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="btn btn-primary contact-submit-btn"
                  disabled={loading}
                >
                  <Send size={16} style={{ marginRight: '8px' }} />
                  <span>{loading ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            ) : (
              <motion.div 
                className="success-state"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="success-icon-wrapper">
                  <CheckCircle size={36} />
                </div>
                <h2 className="success-title">Message Received!</h2>
                <p className="success-text">
                  Thank you for reaching out. We have logged your support ticket and will get back to you shortly.
                </p>
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={handleReset}
                  style={{ marginTop: 'var(--space-4)', minWidth: '160px' }}
                >
                  Send Another Message
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
