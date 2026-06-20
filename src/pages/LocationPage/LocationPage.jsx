import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Compass, Navigation, Clock, Phone, Check, ChevronRight } from 'lucide-react';
import { useOrderStore } from '@/store/useOrderStore';
import { LOCATIONS, getLocationsWithDistance } from '@/data/locations';
import toast from 'react-hot-toast';
import './LocationPage.css';

export default function LocationPage() {
  const navigate = useNavigate();
  const {
    selectedLocation,
    orderType,
    tableNumber,
    setLocation,
    setOrderType,
    setTableNumber,
  } = useOrderStore();

  const [locations, setLocations] = useState(LOCATIONS);
  const [loadingGeo, setLoadingGeo] = useState(false);
  const [geoError, setGeoError] = useState(null);
  const [coords, setCoords] = useState(null);

  // Auto-detect geolocation
  useEffect(() => {
    if ('geolocation' in navigator) {
      setLoadingGeo(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCoords({ lat, lng });
          const sorted = getLocationsWithDistance(lat, lng);
          setLocations(sorted);
          setLoadingGeo(false);
          // Auto-select nearest location if none is selected
          if (!selectedLocation) {
            setLocation(sorted[0]);
            toast.success(`Nearest cafe detected: ${sorted[0].shortName} 📍`);
          }
        },
        (error) => {
          console.warn('Geolocation error:', error);
          setGeoError(error.message);
          setLoadingGeo(false);
          if (!selectedLocation) {
            setLocation(LOCATIONS[0]); // fallback to first
          }
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      if (!selectedLocation) {
        setLocation(LOCATIONS[0]);
      }
    }
  }, []);

  const handleSelectLocation = (loc) => {
    setLocation(loc);
    setTableNumber(null); // Reset table when cafe changes
  };

  const handleToggleOrderType = (type) => {
    setOrderType(type);
  };

  const handleSelectTable = (num) => {
    setTableNumber(num);
  };

  const canContinue = selectedLocation && (orderType === 'takeaway' || tableNumber !== null);

  const handleContinue = () => {
    if (!canContinue) return;
    navigate('/checkout');
  };

  // Generate table array
  const tableLimit = selectedLocation ? selectedLocation.tablesCount : 20;
  const tables = Array.from({ length: tableLimit }, (_, i) => i + 1);

  return (
    <div className="location-page page-wrapper">
      <div className="container location-page__grid">
        {/* Left Column: Cafe Selection */}
        <div className="location-page__selection">
          <div className="location-header-block">
            <h1 className="location-page__title">Select Location</h1>
            <p className="location-page__sub">
              Where would you like to collect or enjoy your Chilld coffee?
            </p>

            {loadingGeo && (
              <div className="geo-status-indicator pulse">
                <Compass className="spin" size={14} />
                <span>Finding nearest cafe...</span>
              </div>
            )}
            {!loadingGeo && coords && (
              <div className="geo-status-indicator success">
                <Navigation size={14} />
                <span>Location detected & sorted by distance</span>
              </div>
            )}
          </div>

          <div className="locations-list">
            {locations.map((loc, idx) => {
              const isSelected = selectedLocation?.id === loc.id;
              const isNearest = idx === 0 && coords;

              return (
                <button
                  key={loc.id}
                  className={`location-tile ${isSelected ? 'location-tile--selected' : ''}`}
                  onClick={() => handleSelectLocation(loc)}
                  type="button"
                >
                  <div className="location-tile__img">
                    <img src={loc.image} alt={loc.shortName} loading="lazy" />
                    {isNearest && <span className="nearest-badge">Nearest</span>}
                  </div>
                  <div className="location-tile__details">
                    <div className="location-tile__header">
                      <h3>{loc.name}</h3>
                      {loc.distance !== undefined && (
                        <span className="distance-label">
                          {loc.distance.toFixed(1)} km away
                        </span>
                      )}
                    </div>
                    <p className="address-text">{loc.address}</p>

                    <div className="location-tile__meta">
                      <span className="meta-item">
                        <Clock size={12} />
                        {loc.hours}
                      </span>
                      {loc.tags && (
                        <div className="tag-badges">
                          {loc.tags.map((tag) => (
                            <span key={tag} className="tag-badge">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="location-tile__select">
                    {isSelected ? (
                      <div className="selected-circle">
                        <Check size={16} strokeWidth={3} />
                      </div>
                    ) : (
                      <ChevronRight size={18} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Order Type & Dining Table Setup */}
        <div className="location-page__config">
          <div className="config-sticky">
            <h2 className="section-title-small">Order Details</h2>

            {/* Dine-In / Takeaway Toggle */}
            <div className="order-type-toggle">
              <button
                className={`toggle-btn ${orderType === 'dine-in' ? 'toggle-btn--active' : ''}`}
                onClick={() => handleToggleOrderType('dine-in')}
                type="button"
              >
                <span>Dine In ☕</span>
                {orderType === 'dine-in' && (
                  <motion.div className="toggle-bg" layoutId="active-order-type" />
                )}
              </button>
              <button
                className={`toggle-btn ${orderType === 'takeaway' ? 'toggle-btn--active' : ''}`}
                onClick={() => handleToggleOrderType('takeaway')}
                type="button"
              >
                <span>Takeaway 🛍️</span>
                {orderType === 'takeaway' && (
                  <motion.div className="toggle-bg" layoutId="active-order-type" />
                )}
              </button>
            </div>

            {/* Table Selection */}
            <AnimatePresence mode="wait">
              {orderType === 'dine-in' ? (
                <motion.div
                  key="dine-in-setup"
                  className="dine-in-setup"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="tables-header">
                    <h3>Select Table Number</h3>
                    <p>Find a table in our cafe and tap its number below.</p>
                  </div>

                  <div className="tables-grid">
                    {tables.map((num) => {
                      const isSelected = tableNumber === num;
                      return (
                        <button
                          key={num}
                          className={`table-node ${isSelected ? 'table-node--selected' : ''}`}
                          onClick={() => handleSelectTable(num)}
                          type="button"
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="takeaway-setup"
                  className="takeaway-setup"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="takeaway-card">
                    <div className="takeaway-emoji">🛍️</div>
                    <h3>Ready for pickup</h3>
                    <p>
                      We'll package your drink in our premium eco-friendly carry bag. We'll notify you
                      once it's ready at the counter.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Continue Button */}
            <div className="config-actions">
              <button
                className={`btn btn-primary continue-btn ${canContinue ? '' : 'disabled'}`}
                onClick={handleContinue}
                disabled={!canContinue}
              >
                Confirm & Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
