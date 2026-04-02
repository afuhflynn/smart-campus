export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="w-screen h-screen overflow-hidden">{children} </div>;
}
