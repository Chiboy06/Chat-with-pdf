import Header from "@/components/Header"
import { ClerkLoaded } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server";
import SignInPage from "../sign-in/[[...sign-in]]/page";

async function DashboardLayout({ children }: { children: React.ReactNode }) {
  auth().protect();
  const { userId } = await auth();

  if (!userId) return <SignInPage/>

  return (
    <ClerkLoaded>
        <div className="flex-1 flex bg-gradient-to-b from-gray-200 to-orange-200 flex-col h-screen w-full">    
            <Header/>
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    </ClerkLoaded>
  )
}

export default DashboardLayout