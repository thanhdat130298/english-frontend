export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <section style={{ background: "#2a42a3", padding: "20px", minHeight: "100vh" }}>
      <h1>🔐 Đăng Nhập</h1>
      {children}
    </section>
  );
}
