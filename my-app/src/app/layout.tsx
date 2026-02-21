import '@/app/globals.css';
import '@/styles/fonts.css';
import '@/styles/theme.css';

export const metadata = {
  title: 'AI Agent - Multi-Domain Logistics Intelligence System',
  description: 'AI-powered multi-domain agent interface for managing tasks across Logistics Risk Management and Operations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
