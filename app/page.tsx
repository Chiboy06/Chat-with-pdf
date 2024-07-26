import { Button } from "@/components/ui/button";
import { BrainCogIcon, EyeIcon, GlobeIcon, MonitorSmartphoneIcon, ServerCogIcon, ZapIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    id: 1,
    name: "Store your PDF Documents",
    description: "Keep all your PDF files securely stored and easily accessible anytime, anywhere.",
    icon: GlobeIcon
  },
  {
    id: 2, 
    name: "Blazing Fast Responses",
    description:
      "Experience lighting-fast answers to your queries, ensuring you get the information you need instantly.",
    icon: ZapIcon
  },
  {
    id: 3,
    name: "Chat Memorisation",
    description:
      "Our intelligent chatbot remembers previous interactions, providing a seamless and personalized experience.",
    icon: BrainCogIcon
  },
  {
    id: 4,
    name: "Interactive PDF Viewer",
    description:
      "Engage with your PDF's like never before using an intuitive and interactive viewer.",
    icon: EyeIcon
  },
  {
    id: 5,
    name: "Cloud Backup",
    description:
      "Rest assured knowing your documents are safely backed up on the cloud, protected from loss or damage.",
    icon: ServerCogIcon
  },
  {
    id: 6,
    name: "Responsive across Devices",
    description:
      "Access and chat with your PDF's seamlessly on any device, whether it's your desktop, tablet, or smartphone.",
    icon: MonitorSmartphoneIcon
  },
]


export default function Home() {
  return (
    <main className=" flex-1 relative overflow-scroll p-2 lg:p-5 bg-gradient-to-br from-pink-400 to-[#c18bc3]">
      <div className="bg-gray-900 py-24 sm:py-32 rounded-md drop-shadow-xl">
        <div className="flex flex-col justify-center items-center mx-auto max-w-7xl px-6 lg:px-8">
          <div
            className="absolute inset-x-0 top-48 -z-10 transform-gpu overflow-hidden blur-3xl"
            aria-hidden="true"
          >
          <div
            className='relative left-[calc(50%-11rem)] aspect-[1155/678] w-[54.125rem]
            -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc]
             opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] -z-20'
             style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1%, 97.7%, 74.1% 44.14%]"
             }}
          />
          </div>
          <div className="mx-auto z-20 max-w-2xl sm:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              Your Interactive Document Companion
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-400 sm:text-6xl">
              Transform Your PDFs into Interactive Conversations
            </p>

            <p className="mt-6 text-lg leading-6 text-gray-400">
              Introducing {" "}
              <span className="font-bold text-indigo-600">Chat with PDF.</span>
              <br />
              <br /> Upload your document, and our chatbot will answer questions, summarize content, and answer all your Qs.
              Ideal for everyone, <span className="text-indigo-600">Chat with PDF</span>{" "}
              turns static documents into {" "}
              <span className="font-bold">dynamic conversations</span>,
              enhancing productivity 10x fold effortlessly. 
            </p>
          </div>

          <Button asChild className="mt-10 bg-gradient-to-r from-gray-400 to-indigo-400">
            <Link href="/sign-in">Get Started</Link>
          </Button>

          
          </div>

          <div className="relative overflow-hidden pt-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <Image
                alt="App screenshot"
                src="https://i.imgur.com/VciRSTI.jpeg"
                width={2432}
                height={1442}
                className="mb-[-0%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
              />

              <div aria-hidden="true" className="relative">
                <div className="absolute bottom-0 -inset-x-32 bg-gradient-to-t from-gray-900/95 pt-[5%]"/>
              </div>
            </div>
          </div>

          <div className="px-3 pt-3">
            <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10
            text-base leading-7 text-gray-400 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8">
              {features.map(feature => (
                <div key={feature.id} className="relative pl-9">
                  <dt className="inline font-semibold text-gray-900">
                    <feature.icon
                      aria-hidden="true"
                      className="absolute left-1 top-1 h-5 w-5 text-indigo-600"
                    />
                  </dt>

                  <dd>{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        
      </div>
    </main>
  );
}
