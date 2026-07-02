import { useState, useEffect } from 'react';
import HomePage from '@/pages/HomePage/HomePage';
import MobileHomePage from '@/pages/HomePage/MobileHomePage';
import { getNativeDeviceMode } from '@/utils/deviceDetection';

export default function DeviceLayoutSelector() {
  const [activeMode, setActiveMode] = useState(() => getNativeDeviceMode());

  useEffect(() => {
    const handleResize = () => {
      setActiveMode(getNativeDeviceMode());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className={`device-layout-selector site-mode-${activeMode}`}
      data-native-device-mode={activeMode}
    >
      {activeMode === 'mobile' ? <MobileHomePage /> : <HomePage />}
    </div>
  );
}
