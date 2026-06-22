import NextAuthProvider from "@/providers/NextAuthProvider";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextAuthProvider>
      <div className="min-h-screen bg-[#080808] text-white flex">
        {/* Fixed sidebar */}
        <AdminSidebar />

        {/* Content body offset by sidebar width */}
        <div className="flex-1 ml-64 min-h-screen flex flex-col">
          <main className="flex-1 p-8 md:p-12 bg-[#080808]">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </NextAuthProvider>
  );
}
