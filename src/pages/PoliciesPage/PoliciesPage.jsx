import { useState, useEffect } from 'react';
import { Shield, FileText, RefreshCw, Truck, Mail } from 'lucide-react';
import './PoliciesPage.css';

export default function PoliciesPage() {
  const [activeTab, setActiveTab] = useState('privacy');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  return (
    <div className="policies-page">
      <div className="policies-hero">
        <div className="policies-hero__graffiti" aria-hidden="true" />
        <div className="policies-hero__content">
          <p className="policies-hero__eyebrow">CHILLD LEGAL &amp; COMPLIANCE</p>
          <h1>Policy Center</h1>
          <p className="policies-hero__subtitle">
            Transparent policies governing your cold brew coffee experience.
          </p>
        </div>
      </div>

      <div className="policies-container">
        {/* Navigation Tabs */}
        <nav className="policies-nav" aria-label="Legal Policy Navigation">
          <button
            type="button"
            className={`policies-nav__btn ${activeTab === 'privacy' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            <Shield size={18} />
            <span>Privacy Policy</span>
          </button>
          <button
            type="button"
            className={`policies-nav__btn ${activeTab === 'terms' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('terms')}
          >
            <FileText size={18} />
            <span>Terms &amp; Conditions</span>
          </button>
          <button
            type="button"
            className={`policies-nav__btn ${activeTab === 'refund' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('refund')}
          >
            <RefreshCw size={18} />
            <span>Refund &amp; Return</span>
          </button>
          <button
            type="button"
            className={`policies-nav__btn ${activeTab === 'shipping' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('shipping')}
          >
            <Truck size={18} />
            <span>Shipping &amp; Delivery</span>
          </button>
        </nav>

        {/* Policy Content */}
        <main className="policies-content">
          {activeTab === 'privacy' && (
            <section className="policy-section">
              <h2>Privacy Policy</h2>
              <p className="policy-meta">Effective Date: July 24, 2026 • Entity: Chilld Coffee Products Pvt Ltd</p>

              <h3>1. Information We Collect</h3>
              <p>
                We collect personal details such as your name, email address, contact number, delivery address, and payment confirmation details when you make a purchase or interact with our web applications. We also collect non-personal browser diagnostics to improve page load speed and user experience.
              </p>

              <h3>2. How We Use Information</h3>
              <p>
                Your data is exclusively used to process and fulfill your cold brew concentrate orders, communicate real-time shipment updates, provide customer support, and improve our product offerings.
              </p>

              <h3>3. Data Protection &amp; Third-Party Sharing</h3>
              <p>
                We <strong>do not sell, trade, or rent</strong> your personal information to third parties. Data is shared strictly with trusted payment partners and logistics services necessary to fulfill your transactions. All online transactions are encrypted via industry-standard SSL protocols.
              </p>
            </section>
          )}

          {activeTab === 'terms' && (
            <section className="policy-section">
              <h2>Terms &amp; Conditions</h2>
              <p className="policy-meta">Effective Date: July 24, 2026 • Entity: Chilld Coffee Products Pvt Ltd</p>

              <h3>1. Acceptance of Terms</h3>
              <p>
                By placing an order or browsing our application, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree with any part of these terms, please do not use our services.
              </p>

              <h3>2. Intellectual Property</h3>
              <p>
                All brand logos, text, custom recipe code, graphics, product visuals, and software architecture belong exclusively to <strong>Chilld Coffee Products Pvt Ltd</strong> and are protected under Indian intellectual property laws.
              </p>

              <h3>3. Pricing &amp; Modifications</h3>
              <p>
                Product pricing, availability, and promotional offers are subject to change without prior notice. We reserve the right to decline or cancel any orders placed with incorrect prices due to technical anomalies.
              </p>
            </section>
          )}

          {activeTab === 'refund' && (
            <section className="policy-section">
              <h2>Refund &amp; Return Policy</h2>
              <p className="policy-meta">Effective Date: July 24, 2026 • Entity: Chilld Coffee Products Pvt Ltd</p>

              <h3>1. Perishable Food Items</h3>
              <p>
                Because cold brew coffee concentrates are perishable food products, <strong>we cannot accept physical returns</strong> once an order has been successfully delivered to your address.
              </p>

              <h3>2. Refund / Replacement Eligibility</h3>
              <p>
                We will issue a full refund or send a fresh replacement at no extra charge under the following circumstances:
              </p>
              <ul>
                <li>The package arrives visibly damaged, broken, or leaking.</li>
                <li>An incorrect item or missing product was delivered.</li>
                <li>A quality defect is reported within <strong>48 hours</strong> of delivery along with photographic evidence.</li>
              </ul>

              <h3>3. How to Request a Refund</h3>
              <p>
                Please email our support team at <a href="mailto:support@chilld.in">support@chilld.in</a> or visit our Contact page with your Order ID and photo proof. Approved refunds are credited to your original payment method within <strong>5–7 business days</strong>.
              </p>
            </section>
          )}

          {activeTab === 'shipping' && (
            <section className="policy-section">
              <h2>Shipping &amp; Delivery Policy</h2>
              <p className="policy-meta">Effective Date: July 24, 2026 • Entity: Chilld Coffee Products Pvt Ltd</p>

              <h3>1. Processing &amp; Dispatch</h3>
              <p>
                All orders are freshly prepared and dispatched within <strong>24 to 48 hours</strong> of payment confirmation on business days.
              </p>

              <h3>2. Delivery Timelines</h3>
              <p>
                Estimated delivery timelines range from <strong>1 to 3 business days</strong> depending on your region and pin code accessibility.
              </p>

              <h3>3. Order Tracking</h3>
              <p>
                Once your package is handed over to our courier partner, you will receive an SMS and email notification containing your live shipment tracking URL.
              </p>
            </section>
          )}

          {/* Footer Contact Info */}
          <div className="policy-contact-box">
            <Mail size={22} />
            <div>
              <h4>Have questions regarding our policies?</h4>
              <p>Reach out to our compliance team at <strong>support@chilld.in</strong></p>
              <span className="policy-cert-badges">
                FSSAI LIC NO. 11526997000706 • Startup India Registered (DPIIT)
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
