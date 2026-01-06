'use client'
import React from 'react'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
}from "@/components/ui/sheet"
import Image from 'next/image'
import Link from 'next/link'
import { sidebarLinks } from '@/constants'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import Footer from './Footer'
const MobileNav = ({user}:
    MobileNavProps
) => {
    const pathname=usePathname()
  return (
    <section className='w-full max-w-66'>
        <Sheet>
            <SheetTrigger>
                <Image
                   src="/icons/hamburger.svg"
                   width={30}
                   height={30}
                   className='cursor-pointer'
                   alt="menu"
                />
            </SheetTrigger>
            <SheetContent side="left" className='border-none bg-white '>
                    <Link href="/"
                className='mb-12 cursor-pointer flex items-center gap-2 px-4'
                >
                    <Image src="/icons/logo.svg"
                    width={34}
                    height={34}
                    alt="Horizon logo"               
                    
                    />
                    <h1 className='text-26 font-ibm-plex-serif font-bold text-blue-950 '>Horizon</h1>
                </Link>
                <div className='mobilenav-sheet'>
                    <SheetClose asChild>
                        <nav className='flex h-full flex-col gap-6 pt-16 text-white'>
                           {sidebarLinks.map((item)=>{
                    const isActive = pathname===item.route ||
                    pathname.startsWith(`${item.route}/`)
                    return (
                        <SheetClose asChild key={item.route}>
                        <Link href={item.route}
                        key={item.label}
                        className={cn('m-4 mobilenav-sheet_close h-8 w-full ',{'bg-blue-500':isActive})}>
                            <div className='relative size-6'>
                                <Image
                                src={item.imgURL}
                                alt={item.label}
                                width={20}
                                height={20}
                                className={cn({
                                    'brightness-[3] invert-0': isActive
                                })}
                                />

                            </div>
                            <p className={cn("text-16 font-semibold  text-black", { "text-white": isActive })}>
                    {item.label}
                </p>
                        </Link>
                        </SheetClose>
                    )
                })}
                    USER
                        </nav>
                    </SheetClose>
                    <Footer user={user} type="mobile"/>
                </div>
                
            </SheetContent>
        </Sheet>
    </section>
  )
}

export default MobileNav