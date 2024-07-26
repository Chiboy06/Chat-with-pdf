import Header from "@/components/Header"
import { ClerkLoaded } from "@clerk/nextjs"

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkLoaded>
        <div className="flex-1 flex flex-col h-screen bg-gradient-to-br from-gray-700 to-[#c18bc3]">
            
            <Header/>
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    </ClerkLoaded>
  )
}

export default DashboardLayout