import { Link } from 'react-router-dom';
import Logo from '@/components/Logo/Logo';
import './Footer.css';

const shopLinks = [
  { label: 'All Products', to: '/menu' },
  { label: 'Store (Soon)', to: '/store' },
  { label: 'B2B (Soon)', to: '/b2b' },
  { label: 'Create Your Drink', to: '/build' },
  { label: 'Cart', to: '/checkout' },
];

const exploreLinks = [
  { label: 'About Us', to: '/#hard-part' },
  { label: 'Create Recipe', to: '/create-recipe' },
  { label: 'Recipes', to: '/recipes' },
  { label: 'Contact', to: '/contact' },
];

const otherLinks = [
  { label: 'Refund Policy', to: '/profile' },
  { label: 'Privacy Policy', to: '/profile' },
  { label: 'Terms of Service', to: '/profile' },
  { label: 'Shopping Policy', to: '/checkout' },
];

function SocialIcon({ label, children }) {
  return (
    <a href="#" className="footer__social-link" aria-label={label}>
      {children}
    </a>
  );
}

function FooterColumn({ title, links }) {
  return (
    <nav className="footer__column" aria-label={title}>
      <h2>{title}</h2>
      {links.map((link) => (
        <Link key={link.label} to={link.to}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export default function Footer({ className = '' }) {
  return (
    <footer className={`footer ${className}`.trim()}>
      <svg className="footer-wave-svg" viewBox="0 0 1512 230" preserveAspectRatio="none">
        <defs>
          <path
            id="footer-wave-text-path"
            d="M -180 236 C -120 236, -60 181.3, 0 208 L 63 179.96 C 126 152.35, 252 95.65, 378 95.97 C 504 95.65, 630 152.35, 756 179.96 C 882 208, 1008 208, 1134 179.96 C 1260 152.35, 1386 95.65, 1449 68.03 L 1512 40 C 1572 13.3, 1632 -14, 1692 -14"
          />
        </defs>

        <rect width="1512" height="230" fill="#ffffff" />

        <path
          d="M -180 236 C -120 236, -60 181.3, 0 208 L 63 179.96 C 126 152.35, 252 95.65, 378 95.97 C 504 95.65, 630 152.35, 756 179.96 C 882 208, 1008 208, 1134 179.96 C 1260 152.35, 1386 95.65, 1449 68.03 L 1512 40 C 1572 13.3, 1632 -14, 1692 -14
       V280 H-180 Z"
          fill="#1F2A44"
        />

        <text
          className="footer-wave-svg__text"
          fill="#1F2A44"
          fontSize="32"
          fontWeight="900"
          fontFamily="var(--font-heading)"
          letterSpacing="0.06em"
          dy="-10"
        >
          <textPath href="#footer-wave-text-path" startOffset="0%">
            Great coffee, made easy.......Great coffee, made easy.......Great coffee, made easy.......Great coffee, made easy.......Great coffee, made easy.......Great coffee, made easy.......Great coffee, made easy.......Great coffee, made easy.......
            <animate attributeName="startOffset" from="-45%" to="0%" dur="18s" repeatCount="indefinite" />
          </textPath>
        </text>
      </svg>

      <div className="footer__inner">
        <section className="footer__brand" aria-label="Chilld Coffee">
          <Link to="/" className="footer__logo" aria-label="Chilld home">
            <Logo width="82px" height="auto" color="#E6F4FF" />
          </Link>

          <p>
            Modern cold coffee brand built for fast-moving urban lifestyles.
            Designed for Gen Z and Millennial working professionals, the brand
            blends personalization, convenience, and calm energy into one
            seamless coffee experience.
          </p>

          <div className="footer__social-row">
            <span>We&apos;re on Social Media</span>
            <SocialIcon label="Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14.2 8.2V6.7c0-.7.5-.9.9-.9h2.3V2h-3.2c-3.6 0-4.4 2.7-4.4 4.4v1.8H7v3.9h2.8V22h4.4v-9.9h3l.5-3.9h-3.5Z" />
              </svg>
            </SocialIcon>
            <SocialIcon label="Twitter">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21.5 6.1c-.7.3-1.4.5-2.2.6.8-.5 1.3-1.2 1.6-2.1-.8.5-1.6.8-2.5 1A3.8 3.8 0 0 0 11.8 9c0 .3 0 .6.1.9A10.9 10.9 0 0 1 4 5.8a3.8 3.8 0 0 0 1.2 5.1c-.6 0-1.2-.2-1.7-.5v.1c0 1.8 1.3 3.3 3 3.7-.3.1-.7.1-1 .1-.2 0-.5 0-.7-.1.5 1.5 1.9 2.6 3.6 2.7A7.7 7.7 0 0 1 2.7 18.5 10.8 10.8 0 0 0 8.6 20c7.1 0 11-5.9 11-11v-.5c.8-.6 1.4-1.3 1.9-2.1Z" />
              </svg>
            </SocialIcon>
            <SocialIcon label="LinkedIn">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6.7 8.8H3.1V21h3.6V8.8ZM4.9 3A2.1 2.1 0 1 0 5 7.2 2.1 2.1 0 0 0 4.9 3Zm16 11c0-3.3-1.8-5.5-4.7-5.5-1.6 0-2.8.9-3.3 1.8h-.1V8.8H9.4V21H13v-6c0-1.6.3-3.1 2.2-3.1 1.9 0 1.9 1.8 1.9 3.2V21h3.7v-7Z" />
              </svg>
            </SocialIcon>
            <SocialIcon label="YouTube">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.9 4.8 12 4.8 12 4.8s-5.9 0-7.6.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2 12a29 29 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.7.4 7.6.4 7.6.4s5.9 0 7.6-.4a2.8 2.8 0 0 0 2-2A29 29 0 0 0 22 12a29 29 0 0 0-.4-4.8ZM10 15.2V8.8l5.3 3.2-5.3 3.2Z" />
              </svg>
            </SocialIcon>
          </div>

          <div className="footer__certifications" aria-label="Certifications">
            <div className="footer__cert footer__cert--fssai">
              <img src="/images/fssai.png" alt="FSSAI licensed" className="footer__cert-img" />
              <span>LIC NO. 21526004000813</span>
            </div>
            <div className="footer__cert footer__cert--dpiit">
              <img src="/images/image2_366_1172.png" alt="DPIIT Startup India registered" className="footer__cert-img" />
              <span>Startup India Registered</span>
            </div>
          </div>
        </section>

        <div className="footer__links">
          <FooterColumn title="Shop" links={shopLinks} />
          <FooterColumn title="Explore" links={exploreLinks} />
          <FooterColumn title="Other" links={otherLinks} />
        </div>

        <p className="footer__copyright">
          © 2026, Chilld Coffee Products Pvt Ltd • Design by Comsci &amp; Developed by Vasify Technologies
        </p>

        <div className="footer__watermark" aria-hidden="true">
          <Logo width="100%" height="100%" color="#E6F4FF" />
        </div>
      </div>
    </footer>
  );
}
