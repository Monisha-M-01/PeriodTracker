import React from 'react';

export function AmbientParticles() {
  const particles = Array.from({ length: 6 });

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {particles.map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-primary"
          style={{
            width: Math.random() * 8 + 4 + 'px',
            height: Math.random() * 8 + 4 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            filter: 'blur(2px)',
            opacity: 0,
            animation: `floatParticle ${Math.random() * 10 + 15}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  );
}
