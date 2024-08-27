import Header from "@/components/Header"
import { ClerkLoaded } from "@clerk/nextjs"

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkLoaded>
        <div className="flex-1 flex bg-gradient-to-b from-gray-200 to-orange-200 flex-col h-screen ">
            
            <Header/>
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    </ClerkLoaded>
  )
}

export default DashboardLayout