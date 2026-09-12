import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="es">
      <body>
        <div style={{ textAlign: "center", padding: "5rem 1rem" }}>
          <p style={{ fontSize: "3rem" }}>👻</p>
          <h1>Página no encontrada / Page not found</h1>
          <p>
            <Link href="/es">Español</Link> · <Link href="/en">English</Link>
          </p>
        </div>
      </body>
    </html>
  );
}
