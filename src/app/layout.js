import "./globals.css";

export const metadata = {
  title: "Fysalidev — Forger demain ensemble",
  description:
    "Conception de sites vitrine et d'applications métier sur mesure. Discutons de votre projet autour d'un café, quand vous voulez…",
};

export const viewport = {
  themeColor: "#171310",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
