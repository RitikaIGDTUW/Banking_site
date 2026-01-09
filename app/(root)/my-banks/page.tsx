import BankCard from '@/components/BankCard'
import HeaderBox from '@/components/HeaderBox'
import { getAccounts } from '@/lib/actions/bank.actions'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import React from 'react'

const MyBanks = async () => {
  const loggedIn = await getLoggedInUser()
  const accounts = await getAccounts({ userId: loggedIn.$id })

  // safety: if no accounts, return null or empty array
  const accountList = accounts?.data || []

  return (
    <section className='flex' >
      <div className='my-banks' style={{padding:'2rem'}}>
        <HeaderBox
          title="My Bank Accounts"
          subtext="Effortlessly manage your banking activities"
        />
        <div className='space-y-4'>
          <h2 className='header-2'>
            Your Cards
          </h2>
          <div className='flex flex-wrap gap-6'>
            {accountList.length > 0 ? (
              accountList.map((a: Account) => (
                <BankCard
                  key={a.id}  // ✅ use individual account ID
                  account={a}
                  userName={loggedIn?.firstName}
                  showIcon={true}
                />
                
              ))
            ) : (
              <p className='text-gray-500'>No accounts found.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default MyBanks
