export default function LayoutsNotFound({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#f0f0f0", padding: "20px" }}>
      <h2>🔑 Authentication Layout</h2>
      {children}
    </div>
  );
}
