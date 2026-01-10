import HeaderBox from '@/components/HeaderBox'
import TransactionsTable from '@/components/TransactionsTable'
import Category from '@/components/Category'

import { getAccount, getAccounts } from '@/lib/actions/bank.actions'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import { countTransactionCategories, formatAmount } from '@/lib/utils'

import React from 'react'
import ScrollToCategoriesButton from '@/components/ScrollToCategoriesButton'

const TransactionHistory = async ({ searchParams }: SearchParamProps) => {
  // ✅ unwrap search params
  const { id, page } = await searchParams
  const currentPage = Number(page) || 1

  // ✅ get logged-in user
  const loggedIn = await getLoggedInUser()

  // ✅ get all accounts
  const accounts = await getAccounts({
    userId: loggedIn.$id,
  })

  if (!accounts) return null

  const accountsData = accounts.data

  // ✅ select account (from URL or default)
  const appwriteItemId =
    (id as string) || accountsData[0]?.appwriteItemId

  const account = await getAccount({ appwriteItemId })

  if (!account) return null

  // ✅ compute top categories from transactions
  const categories = countTransactionCategories(
    account.transactions || []
  )

  return (
    <div className='transactions'>
      <div className='transaction-header'>
        <HeaderBox
          title="Transaction History"
          subtext="See your bank details and transactions"
        />
      </div>

      <div className='space-y-6'>
        <div className='transactions-account' style={{ padding: '1rem' }}>
          <div className='flex flex-col gap-2' style={{ padding: '1rem' }}>
            <h2 className='text-18 font-bold text-white'>
              {account?.data.name}
            </h2>

            <p className='text-14 text-white'>
              {account?.data.officialName}
            </p>

            <p className='text-14 font-semibold tracking-[1.1px] text-white'>
              ●●●● ●●●● ●●●● {account?.data.mask}
            </p>
          </div>
            {/* 👈 Scroll button */}
            <ScrollToCategoriesButton />
          <div className="transactions-account-balance flex flex-row items-center gap-4 p-4">
  

  {/* Balance */}
  <div style={{padding:'1rem'}}>
    <p className="text-14 text-white">Current balance</p>
    <p className="text-24 font-bold text-white">
      {formatAmount(account.data.currentBalance)}
    </p>
  </div>
</div>

        </div>

        <section className='flex w-full flex-col gap-6'>
          <TransactionsTable
            transactions={account?.transactions}
          />
          <div style={{marginTop:'1rem'}}></div>
        </section>
        {/* ✅ Top Categories Section */}
        <section id="top-categories" className="mt-10 space-y-6 bg-yellow-50" style={{padding:'1rem'}}>
          <h2 className="header-2 rounded-2xl font-bold bg-blue-500" style={{marginTop:'1rem', marginBottom:'1rem', padding:'1rem', color:'white'}}>Top Categories</h2>

          {categories.length > 0 ? (
            <div className="space-y-4">
              {categories.slice(0, 5).map((category) => (
                <Category
                  key={category.name}
                  category={category}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">
              No category data available.
            </p>
          )}
        </section>
      </div>
      
    </div>
  );
};

export default TransactionHistory;
