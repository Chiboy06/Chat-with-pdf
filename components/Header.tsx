'use client'

import { SignedIn, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { FilePlus2 } from 'lucide-react'
import UpgradeButton from './UpgradeButton'
import { useMediaQuery } from 'react-responsive'


function Header() {
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  return (
    <div className='flex justify-between backdrop-opacity-10 backdrop-brightness-125 bg-white/50 shadow-sm backdrop-blur-sm p-5 border-b'>
        <Link
              href='/dashboard'
              className='text-2xl'
        >
            PDF <span className="text-[#e079b5]">Genie</span>      
        </Link>

        <SignedIn>
            <div className='flex items-center space-x-2'>
                <Button asChild variant="link" className='hidden md:flex'>
                    <Link href='/dashboard/upgrade'>Pricing</Link>   
                </Button>
                
                {isTabletOrMobile ? (
                    <Button asChild variant="outline" className='border-indigo-600'>
                        <Link href='/dashboard'>Docs</Link>   
                    </Button>
                ) : (
                    <Button asChild variant="outline" className='border-indigo-600'>
                        <Link href='/dashboard'>My Documents</Link>   
                    </Button> 
                )}
                
                
                <Button asChild variant="outline" className='border-indigo-600'>
                    <Link href='/dashboard/upload'>
                        <FilePlus2 className='text-indigo-600' />
                    </Link>   
                </Button>
                  {/* Upgrade Button */}
                <UpgradeButton/>
                <UserButton/>
            </div>
        </SignedIn>
    </div>
  )
}

export default Header