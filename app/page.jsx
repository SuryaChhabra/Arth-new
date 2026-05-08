'use client';

import dynamic from 'next/dynamic';

// 3D scene must be client-only
const ArthParty = dynamic(() => import('@/components/ArthParty'), { ssr: false });

export default function Page() {
  return <ArthParty />;
}
