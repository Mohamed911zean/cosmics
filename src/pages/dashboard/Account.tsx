import { Mail, Shield, MapPin, Edit, Phone } from "lucide-react"
import { useAuthStore } from "@/stores/useAuthStore"

export default function Account() {
  const { user } = useAuthStore()

  return (
    <div className="space-y-8">
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#4B0082]/10 text-[#4B0082] flex items-center justify-center text-2xl font-semibold">
              {user?.displayName?.[0] || "U"}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#2b2b2b]">{user?.displayName || "Admin User"}</h2>
              <p className="text-sm text-gray-500">Administrator</p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-lg bg-[#4B0082] text-white text-xs font-semibold flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-[#2b2b2b]">Contact Details</h3>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Mail className="w-4 h-4 text-gray-400" />
            {user?.email || "admin@brand.com"}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Phone className="w-4 h-4 text-gray-400" />
            +20 101 234 5678
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <MapPin className="w-4 h-4 text-gray-400" />
            Mansoura, Egypt
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-[#2b2b2b]">Security</h3>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Shield className="w-4 h-4 text-gray-400" />
            Two-factor authentication enabled
          </div>
          <button className="px-4 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Manage Security
          </button>
        </section>
      </div>
    </div>
  )
}
