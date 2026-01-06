import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import BankCard from './BankCard'

const RightSidebar = ({user, transactions, banks}:
    RightSidebarProps
) => {
  return (
    <aside className='right-sidebar'>
        <section className='flex flex-col pb-8'>
            <div className='profile-banner'/>
            <div className='profile'>
                <div className='profile-img'>
                    <span className='text-5xl font-bold text-blue-500'>{user?.firstName?.[0] ?? user?.name?.[0] ?? 'U'}</span>
                </div>                
                
                <div className='profile-details'>
                    <h1 className='profile-name'>
                        {user?.firstName ? `${user.firstName} ${user.lastName ?? ''}` : user?.name ?? 'Guest'}
                    </h1>
                    <p className='profile-email'>
                        {user?.email ?? ''}
                    </p>
                </div>
            </div>
        </section>
        <div className='h-25'></div>
        <section className='banks 'style={{ padding: '0.25rem' }}>
            <div className='flex w-full p-3 justify-between'>
                <h2 className='header-2'>My Banks</h2>
                <Link href="/" className='flex gap-2'>
                  <Image src="/icons/plus.svg"
                  width={20}
                  height={20}
                  alt="plus"/>
                  <h2 className='text-14 font-semibold text-gray-600'>Add Bank</h2>
                </Link>
            </div>
            {banks?.length > 0 ? (
          <div className="relative w-80 flex flex-1 flex-col items-center justify-center gap-5">
            <div className='relative z-10'>
              <BankCard 
                key={banks[0].$id}
                account={banks[0]}
                userName={user?.firstName ? `${user.firstName} ${user.lastName ?? ''}` : user?.name ?? 'Guest'}
                showBalance={false}
                showIcon={true}
              />
            </div>
          {banks[1] && (
            // position the second card centered and slightly lower so both are visible and overlap nicely
            <div className="absolute right-0 top-8 z-0 ">
              <BankCard
                key={banks[1].$id}
                account={banks[1]}
                userName={user?.firstName ? `${user.firstName} ${user.lastName ?? ''}` : user?.name ?? 'Guest'}
                showBalance={false}
                showIcon={true}
              />
            </div>
          )} 
          </div>
        ) : (
          /* Render two demo/placeholder BankCards so the UI is visible during development */
          <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
            <div className='relative z-10'>
              <BankCard
                key={'demo-bank'}
                account={{ $id: 'demo-bank', name: 'Demo Bank', accountNumber: '**** **** **** 1234' } as any}
                userName={`${user.firstName} ${user.lastName}`}
                showBalance={false}
              />
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 top-8 z-0 w-[90%]">
              <BankCard
                key={'demo-bank-dup'}
                account={{ $id: 'demo-bank-dup', name: 'Demo Bank', accountNumber: '**** **** **** 1234' } as any}
                userName={`${user.firstName} ${user.lastName}`}
                showBalance={false}
              />
            </div>
          </div>
        )}
        </section>
    </aside>
    
  )
}

export default RightSidebar