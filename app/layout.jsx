import './globals.css';

export const metadata = {
  title: 'Arth Party — Women’s health, but make it a vibe.',
  description:
    'A walkable, immersive 3D world by Arth by Emcure. Step into the booths, hear the women, find your circle.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-arth-ink text-arth-ink antialiased">{children}</body>
    </html>
  );
}
