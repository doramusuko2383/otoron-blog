'use client';

import { useEffect, useRef, ReactNode } from 'react';

type Props = { children: ReactNode; className?: string };

export default function FadeInOnView({ children, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-inview');
          obs.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={`io-fade ${className}`}>{children}</div>
  );
}
