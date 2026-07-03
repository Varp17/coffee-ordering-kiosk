import { Navigate } from 'react-router-dom';
import { useUserStore } from '@/store/useUserStore';

export default function SkipPageHome() {
  const skipWelcome = useUserStore((state) => state.skipWelcome);
  const skippedWelcome = useUserStore((state) => state.skippedWelcome);

  if (!skippedWelcome) {
    skipWelcome();
  }

  return <Navigate to="/" replace />;
}
