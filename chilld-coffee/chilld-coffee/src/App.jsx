import Navbar from './components/Navbar';
import SaleBanner from './components/SaleBanner';
import Hero from './components/Hero';
import MainContent from './components/MainContent';

function App() {
  return (
    <div className="app">
      <Navbar />
      <SaleBanner />
      <Hero />
      <MainContent />
    </div>
  );
}

export default App;
