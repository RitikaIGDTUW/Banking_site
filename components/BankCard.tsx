import { formatAmount } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const BankCard = ({account, userName, showBalance=true, showIcon=false}:
    CreditCardProps & { showIcon?: boolean }
) => {
  return (
    <div className='flex flex-col'>        
        <Link href='/' className='bank-card'>
        <div className='bank-card-content' style={{ padding: '1.25rem', outline: '1px dashed rgba(255,255,255,0.3)' }}>
            <div>
                <h1 className='text-16 font-semibold text-white'>
                      {account.name || userName}
                </h1>
                <p className='font-ibm-plex-serif font-black text-white'>
                    {formatAmount(account.currentBalance)}
                </p>

            </div>
            <article className='flex flex-col gap-2'>
                <div className='flex justify-between'>
                    <h1 className='text-12 font-semibold text-white'>
                        {userName}   
                    </h1>
                    <h2 className='text-12 font-semibold text-white'>
                        ●● / ●●
                    </h2>
                </div>
                <p className='text-14 font-semibold tracking-[1.1px] text-white'>
                ●●●● ●●●● ●●●● <span className='text-16'>${1234}</span>
                </p>
            </article>
        </div>
                {showIcon && (
                    <div className='bank-card-icon'>
                        <Image src="/icons/lines.png"
                   fill
                   alt="lines"
                   className='absolute top-0 left-0'
                />
                            <img src="/icons/Paypass.svg" width={20} height={24} alt="paypass" style={{ margin:'0.75rem'}} />
                            <img src="/icons/mastercard.svg" width={45} height={32} alt="mastercard" />
                            
                    </div>
                )}
                
        </Link>
        {/* COPY */}
    </div>
  )
}

export default BankCard