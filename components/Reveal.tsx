'use client';
import { useEffect, useRef, ReactNode } from 'react';

export default function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('reveal-in');
            io.unobserve(el);   // 1回だけ
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}
