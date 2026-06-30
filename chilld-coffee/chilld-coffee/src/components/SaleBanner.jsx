import '../styles/SaleBanner.css';

const SaleBanner = () => {
  return (
    <div className="sale-banner">
      <div className="sale-banner-container">
        <p className="sale-text">
          Summer Sale <span className="sale-highlight">30% OFF</span> is Now Live <span className="sale-arrow">&rarr;</span>
        </p>
      </div>
    </div>
  );
};

export default SaleBanner;
