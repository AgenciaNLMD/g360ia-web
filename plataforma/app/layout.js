import "./globals.css";

export const metadata = {
  title: "Programa de afiliados · Gestión 360 IA",
  description:
    "Entrá al panel de afiliados de Gestión 360 IA: el catálogo de software, tu código de referido y tus comisiones.",
  /* El panel no se indexa. Lo que tiene que aparecer en Google es la vidriera
     —g360ia.com.ar/afiliados—, que explica el programa a quien todavía no lo
     conoce. Esta URL es la puerta de entrada de quien ya decidió, y si compite
     por las mismas búsquedas le parte el posicionamiento a aquella. */
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es-AR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="https://g360ia.com.ar/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#0e2137" />
      </head>
      <body>{children}</body>
    </html>
  );
}
