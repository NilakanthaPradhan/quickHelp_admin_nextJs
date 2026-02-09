export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Dashboard
        </h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Metric Cards - Placeholders for now */}
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 shadow-sm">
          <h3 className="text-sm font-medium text-slate-400">Total Users</h3>
          <div className="mt-2 text-2xl font-bold text-white">--</div>
        </div>
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 shadow-sm">
          <h3 className="text-sm font-medium text-slate-400">Pending Requests</h3>
          <div className="mt-2 text-2xl font-bold text-white">--</div>
        </div>
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 shadow-sm">
          <h3 className="text-sm font-medium text-slate-400">Active Providers</h3>
          <div className="mt-2 text-2xl font-bold text-white">--</div>
        </div>
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 shadow-sm">
          <h3 className="text-sm font-medium text-slate-400">Services</h3>
          <div className="mt-2 text-2xl font-bold text-white">--</div>
        </div>
      </div>

      <div className="min-h-[400px] flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900/20 border-dashed">
        <p className="text-slate-500">Analytics & Charts coming soon</p>
      </div>
    </div>
  );
}
