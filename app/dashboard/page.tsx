import Documents from "@/components/Documents"

export const dynamic = "force-dynamic"

function Dashboard() {
  return (
    <div className='h-full max-w-7xl  mx-auto'>
        <h1 className='text-3xl p-5 bg-transparent font-extralight text-[#e079b5]'>
            My Documents
          </h1>
          
          {/* Documents */}
          <Documents/>
    </div>
  )
}

export default Dashboard