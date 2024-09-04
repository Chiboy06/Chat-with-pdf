'use client'
import { useState, useEffect } from 'react'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import PdfView from './PdfView';
import { Button } from './ui/button';
  

function MobileView({ url }: { url: string }) {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); 

  return (
      <Sheet>
        <div className="w-full flex justify-center items-center">
          <SheetTrigger style={{ width: `${width}px`, position: 'relative', bottom: '0' }}>
            <div className='text-center font-bold text-2xl'>View PDF</div>
          </SheetTrigger>
        </div>
        <SheetContent side={'bottom'}>
          <PdfView url={url} />
          <SheetFooter>
              <SheetClose asChild>
                <Button className='bg-[#e079b5]'>Close</Button>
              </SheetClose>
            </SheetFooter>
        </SheetContent>
      </Sheet>

  )
}

export default MobileView