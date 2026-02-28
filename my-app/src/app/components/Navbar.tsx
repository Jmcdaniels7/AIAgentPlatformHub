import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative inline-block group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="relative px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-lg">
              <span className="text-lg font-bold text-white">Logistics AI Agent</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg transition-all duration-200 cursor-pointer">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
