import { ERPSidebar } from "@/components/erp/sidebar";

export default function ERPLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <ERPSidebar />
      <main className="lg:pl-64 min-h-screen transition-all duration-300">
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] overflow-x-hidden">{children}</div>
      </main>
    </div>
  );
}
