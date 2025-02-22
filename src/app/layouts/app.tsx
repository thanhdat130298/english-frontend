export default function LayoutsApp({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav>📊 Dashboard Navbar</nav>
      <main>{children}</main>
    </div>
  );
}
