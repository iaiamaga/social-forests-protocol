import './globals.css';
import ClientOnly from '@/components/ClientOnly';
import PaymentProvider from '@/components/PaymentProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <ClientOnly>
          <PaymentProvider>
            {children}
          </PaymentProvider>
        </ClientOnly>
      </body>
    </html>
  );
}