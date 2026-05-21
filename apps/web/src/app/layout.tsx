import './globals.css';
import ClientOnly from '@/components/ClientOnly';
import PaymentProvider from '@/components/PaymentProvider';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'Social Forests — Prosperidade Programável',
  description: 'Infraestrutura Descentralizada para Green RWA & Finanças Climáticas na Stellar',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ClientOnly>
          <LanguageProvider>
            <AuthProvider>
              <PaymentProvider>
                {children}
              </PaymentProvider>
            </AuthProvider>
          </LanguageProvider>
        </ClientOnly>
      </body>
    </html>
  );
}