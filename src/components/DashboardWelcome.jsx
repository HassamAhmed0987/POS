import { ChefHat } from "lucide-react";
import { Link } from "react-router-dom";

function DashboardWelcome() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-linear-to-r from-orange-600 via-orange-500 to-amber-600 text-white shadow-xl shadow-orange-500/15">
      <div>
        <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full backdrop-blur-xs inline-block mb-2">
          Live Restaurant Overview
        </span>

        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">
          Sizzle & Spice Kitchen Terminal
        </h2>

        <p className="text-orange-100 text-sm mt-1 max-w-xl">
          Real-time management for walk-in counter POS and online delivery
          pipelines.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/pos"
          className="px-5 py-3 rounded-2xl bg-white text-zinc-950 font-bold text-sm hover:bg-orange-50 transition-all shadow-lg flex items-center gap-2"
        >
          <ChefHat className="w-4 h-4 text-orange-600" />
          <span>Open POS Counter</span>
        </Link>

        <Link
          to="/orders"
          className="px-4 py-3 rounded-2xl bg-black/20 hover:bg-black/30 text-white font-bold text-sm"
        >
          Manage Orders
        </Link>
      </div>
    </div>
  );
}

export default DashboardWelcome;