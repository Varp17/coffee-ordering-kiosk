import HomePage from '@/pages/HomePage/HomePage';
import MobileHomePage from '@/pages/HomePage/MobileHomePage';
import { getNativeDeviceMode } from '@/utils/deviceDetection';

export default function DeviceLayoutSelector() {
  const activeMode = getNativeDeviceMode();

  return (
    <div
      className={`device-layout-selector site-mode-${activeMode}`}
      data-native-device-mode={activeMode}
    >
      {activeMode === 'mobile' ? <MobileHomePage /> : <HomePage />}
    </div>
  );
}
