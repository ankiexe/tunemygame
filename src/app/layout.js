import './globals.css';

export const metadata = {
  title: 'TuneMyGame Studio Pro',
  description: 'Deterministic Hardware Telemetry Engine',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#07080c] antialiased">{children}</body>
    </html>
  );
}