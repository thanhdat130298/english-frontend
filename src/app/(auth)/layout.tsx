export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-dark p-5 min-h-screen">
      <h2>🔑 Authentication Layout</h2>
      {children}
    </section>
  );
}
