import { Suspense } from 'react';
import { LoginPage } from '@/components/elevation/public-site';
export default function Page() {
  return (
    <Suspense fallback={null}>
      <LoginPage />
    </Suspense>
  );
}
