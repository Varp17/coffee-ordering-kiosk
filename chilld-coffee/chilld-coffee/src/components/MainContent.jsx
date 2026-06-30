import '../styles/MainContent.css';

const MainContent = () => {
  return (
    <section className="main-content">
      <div className="main-container">
        <div className="content-wrapper">
          <div className="content-left">
            <h2 className="content-heading">Coffee is fuel, not a ceremony</h2>

            <div className="content-body">
              <p>
                Nobody likes a know-it-all. And, neither do you. You like coffee because a) it tastes good, and b) it gives you a rush. Chilld does both. We take care of the nitty-gritties of sourcing. We ensure that you get exceptional coffee concentrate. After that, you are free to tailor your daily coffee to your liking. Add water, if you are in a hurry for your presentation. Add syrup, milk, experiment with everyday ingredients in your kitchen, if you have the time.
              </p>

              <p>
                If you've been on-call all night, add an extra spoon of our cold brew concentrate. If you get jittery, like me, but enjoy the occasional pick-me-up, add a spoon less. No one's judging you.
              </p>

              <p>
                We guarantee that it will taste good; we promise that it won't eat into your wallet. The only person left full and satisfied is you.
              </p>

              <p className="italic-text">
                &ldquo;Coffee is too much work&rdquo; or &ldquo;this sounds difficult&rdquo;
              </p>

              <p>
                If you can make lemonade, iced-water, or pet a cat, this is a walk in the park.
              </p>

              <p>
                Chilld was built for people who like things their way. From milk choices to sweetness levels, every drink is designed by you. No complicated menus. Just cold coffee made for your mood, your routine, and your kind of day.
              </p>
            </div>

            <div className="content-actions">
              <button className="btn-buy">Buy CHILLD Cold Brew Core</button>
              <a href="#" className="link-explore">Explore Recipes &rarr;</a>
            </div>
          </div>

          <div className="content-right">
            <div className="illustration">
              <svg viewBox="0 0 280 380" fill="none" xmlns="http://www.w3.org/2000/svg" className="cup-illustration">
                {/* Hand and arm */}
                <path
                  d="M90 340 C90 310 100 290 120 275 L170 275 C190 290 200 310 200 340"
                  stroke="#1E3A8A"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Fingers wrapping around cup */}
                <path
                  d="M115 280 C115 265 125 258 140 255 L155 255 C165 258 175 265 175 280"
                  stroke="#1E3A8A"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Cup body */}
                <path
                  d="M120 260 L128 130 C128 120 138 110 155 110 C172 110 182 120 182 130 L190 260"
                  stroke="#1E3A8A"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Cup rim */}
                <ellipse
                  cx="155"
                  cy="110"
                  rx="32"
                  ry="7"
                  stroke="#1E3A8A"
                  strokeWidth="2.5"
                  fill="none"
                />
                {/* Coffee surface */}
                <ellipse
                  cx="155"
                  cy="115"
                  rx="28"
                  ry="5"
                  fill="#1E3A8A"
                  opacity="0.15"
                />
                {/* Straw */}
                <line
                  x1="168"
                  y1="70"
                  x2="172"
                  y2="150"
                  stroke="#1E3A8A"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Straw bend top */}
                <path
                  d="M168 70 C168 60 160 55 150 55"
                  stroke="#1E3A8A"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Pour stream from straw */}
                <path
                  d="M155 55 C155 75 145 95 140 110"
                  stroke="#93C5FD"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray="4 4"
                />
                {/* Second pour drip */}
                <path
                  d="M148 60 C148 80 140 100 135 115"
                  stroke="#93C5FD"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.5"
                  strokeDasharray="3 5"
                />
                {/* Ice cubes in cup */}
                <rect x="140" y="140" width="14" height="10" rx="2" stroke="#93C5FD" strokeWidth="1.5" fill="none" transform="rotate(-8 147 145)" />
                <rect x="160" y="155" width="12" height="9" rx="2" stroke="#93C5FD" strokeWidth="1.5" fill="none" transform="rotate(5 166 160)" />
                <rect x="143" y="165" width="11" height="8" rx="2" stroke="#93C5FD" strokeWidth="1.5" fill="none" transform="rotate(-3 148 169)" />
                {/* Cup handle */}
                <path
                  d="M190 160 C210 160 215 180 215 195 C215 210 210 230 190 230"
                  stroke="#1E3A8A"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Steam lines */}
                <path d="M140 95 C138 85 142 80 140 70" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
                <path d="M155 90 C153 80 157 75 155 65" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3" />
                <path d="M168 93 C166 83 170 78 168 68" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.35" />
                {/* Coffee drops / splatter */}
                <circle cx="130" cy="300" r="2" fill="#1E3A8A" opacity="0.15" />
                <circle cx="160" cy="310" r="1.5" fill="#1E3A8A" opacity="0.1" />
                <circle cx="145" cy="320" r="1" fill="#1E3A8A" opacity="0.12" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainContent;
