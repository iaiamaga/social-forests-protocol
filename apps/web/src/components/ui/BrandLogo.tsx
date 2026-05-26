'use client';
import Image from 'next/image';

interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className = '' }: BrandLogoProps) {
  return (
    <div className={`relative flex items-center justify-center p-2 ${className}`}>
      {/* Logo Mobile */}
      <Image
        src="/assets/logo_florestas_3.png"
        alt="Florestas.Social"
        width={40}
        height={40}
        className="object-contain block sm:hidden"
        style={{ height: 'auto', width: 'auto' }}
        priority
      />

      {/* Logo Desktop Tema Claro (Light Mode) */}
      <Image
        src="/assets/logo_florestas_5.png"
        alt="Florestas.Social"
        width={180}
        height={48}
        className="object-contain hidden sm:block dark:hidden"
        style={{ height: 'auto', width: 'auto' }}
        priority
      />

      {/* Logo Desktop Tema Escuro (Dark Mode) */}
      <Image
        src="/assets/logo_florestas_4.png"
        alt="Florestas.Social"
        width={180}
        height={48}
        className="object-contain hidden sm:dark:block"
        style={{ height: 'auto', width: 'auto' }}
        priority
      />
    </div>
  );
}