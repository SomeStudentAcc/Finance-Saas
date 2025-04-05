import Header from "@/components/shared/Header";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <>
      <Header/>
      <main className="px-3 lg:px-14">
        {children}
      </main>
      </>
  );
}
