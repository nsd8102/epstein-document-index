export const metadata = {
  title: "Justice Files Index",
  description: "Searchable index of publicly released documents with source citations.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
