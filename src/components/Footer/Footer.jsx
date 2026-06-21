import { Link } from 'react-router-dom';
import { Coffee, MapPin } from 'lucide-react';
import Logo from '@/components/Logo/Logo';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <div className="footer__logo">
            <Logo width="100px" height="auto" color="white" />
          </div>
          <p className="footer__tagline">
            Craft coffee, your way.<br />Born from curiosity.
          </p>
          <div className="footer__social">
            <a href="#" aria-label="Instagram" className="footer__social-btn">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#" aria-label="Twitter" className="footer__social-btn">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </a>
          </div>
        </div>

        <div className="footer__links-group">
          <h4>Menu</h4>
          <Link to="/menu">All Drinks</Link>
          <Link to="/menu?cat=espresso">Espresso</Link>
          <Link to="/menu?cat=matcha">Matcha</Link>
          <Link to="/build">Build Your Own ✨</Link>
        </div>

        <div className="footer__links-group">
          <h4>Recipes</h4>
          <Link to="/create-recipe">Create Recipe 🎨</Link>
          <Link to="/recipe-details/georgesso">Recipe Details ☕</Link>
        </div>

        <div className="footer__links-group">
          <h4>Visit</h4>
          <Link to="/location"><MapPin size={12} /> Indiranagar</Link>
          <Link to="/location"><MapPin size={12} /> Koramangala</Link>
          <Link to="/location"><MapPin size={12} /> HSR Layout</Link>
          <Link to="/location"><MapPin size={12} /> Whitefield</Link>
        </div>

        <div className="footer__links-group">
          <h4>Account</h4>
          <Link to="/auth">Login / Register</Link>
          <Link to="/checkout">My Orders</Link>
        </div>
      </div>
      <div className="footer__bottom container">
        <p>© {new Date().getFullYear()} Chilld Coffee. All rights reserved.</p>
        <p>Made with ☕ in Bengaluru</p>
      </div>
    </footer>
  );
}
