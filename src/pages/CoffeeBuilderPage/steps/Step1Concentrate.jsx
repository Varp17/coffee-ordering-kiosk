import { useBuilderStore } from '@/store/useBuilderStore';
import '../StepLayout.css';

const CONCENTRATES = [
  {
    id: 'Coffee 50:50',
    name: 'Coffee 50:50',
    qty: '60 gm / 70 gm / 80 gm',
    image: '/images/CofeeBuilder/50-50.png',
    desc: 'Classic balanced blend'
  },
  {
    id: 'Coffee 70:30',
    name: 'Coffee 70:30',
    qty: '45 ml – 80 ml',
    image: '/images/CofeeBuilder/70-30.png',
    desc: 'Stronger coffee kick'
  },
  {
    id: 'Sif',
    name: 'Sif',
    qty: '60 ml',
    image: '/images/CofeeBuilder/Sif.png',
    desc: 'South Indian Filter'
  },
  {
    id: 'Cascara',
    name: 'Cascara',
    qty: '200 ml',
    image: '/images/CofeeBuilder/Cascara.png',
    desc: 'Tea-like coffee cherry'
  },
  {
    id: '100% Arabica',
    name: '100% Arabica',
    qty: '200 ml',
    image: '/images/CofeeBuilder/100%Arabica.png',
    desc: 'Pure single origin'
  },
  {
    id: '60-40',
    name: '60-40',
    qty: '60 gm / 80 gm',
    image: '/images/CofeeBuilder/60-40.png',
    desc: 'Custom blend'
  },
];

export default function Step1Concentrate() {
  const { concentrateType, setConcentrate } = useBuilderStore();

  return (
    <div className="step-layout">
      <div className="step-layout__header">
        <span className="step-layout__emoji">☕</span>
        <h2 className="step-layout__title">Choose Concentrate</h2>
        <p className="step-layout__desc">Select your coffee base</p>
      </div>

      <div className="concentrate-grid">
        {CONCENTRATES.map((c) => {
          const isSelected = concentrateType === c.id;
          return (
            <div
              key={c.id}
              className={`card concentrate-card ${isSelected ? 'selected' : ''}`}
              onClick={() => setConcentrate(c.id, c.qty.split('/')[0].trim())}
            >
              <div className="concentrate-card__img-wrap">
                <img
                  src={c.image}
                  alt={c.name}
                  className="concentrate-card__img"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="concentrate-card__body">
                <h3 className="concentrate-card__name">{c.name}</h3>
                <p className="concentrate-card__desc">{c.desc}</p>
                <span className="concentrate-card__qty">Qty: {c.qty}</span>
              </div>
            </div>
          );
        })}
      </div>

      {concentrateType && (
        <div className="step-continue">
          <p>Selected: {concentrateType}</p>
        </div>
      )}
    </div>
  );
}