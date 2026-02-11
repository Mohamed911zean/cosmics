import { Mail, Shield, MapPin, Phone, Calendar, Briefcase } from "lucide-react"
import { useAuthStore } from "@/stores/useAuthStore"
import { TelegramSetup } from "@/components/dashboard/TelegramSetup"

export default function Account() {
  const { user } = useAuthStore()

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        </div>
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12 relative z-10">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl ring-4 ring-white">
              {user?.displayName?.[0] || "A"}
            </div>
            <div className="flex-1 pt-2 md:pt-0 md:pb-2">
              <h2 className="text-2xl font-bold text-gray-900">{user?.displayName || "Admin User"}</h2>
              <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                <Briefcase className="w-4 h-4" />
                Administrator
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Telegram Setup */}
        <div className="lg:col-span-2">
            <TelegramSetup />
        </div>

        {/* Contact Details */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-white">
            <h3 className="text-base font-bold text-gray-900">Contact Information</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50/50 hover:bg-violet-50/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                <Mail className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Email Address</p>
                <p className="text-sm text-gray-900 font-semibold">{user?.email || "admin@brand.com"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50/50 hover:bg-violet-50/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Phone className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Phone Number</p>
                <p className="text-sm text-gray-900 font-semibold">+20 101 234 5678</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50/50 hover:bg-violet-50/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Location</p>
                <p className="text-sm text-gray-900 font-semibold">Mansoura, Egypt</p>
              </div>
            </div>
          </div>
        </section>

        {/* Account Details */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-white">
            <h3 className="text-base font-bold text-gray-900">Account Details</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50/50 hover:bg-violet-50/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-sky-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-medium">Security Status</p>
                <p className="text-sm text-gray-900 font-semibold">Two-factor authentication enabled</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">Active</span>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50/50 hover:bg-violet-50/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Member Since</p>
                <p className="text-sm text-gray-900 font-semibold">January 2024</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
