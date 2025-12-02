'use client';

import dynamic from 'next/dynamic';

const Canvas = dynamic(() => import('@/components/workspace/Canvas'), { ssr: false });

export default function Home() {
  return (
    <main className="w-full h-screen overflow-hidden">
      <Canvas />
    </main>
  );
}
