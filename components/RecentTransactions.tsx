

'use client';

import Link from 'next/link';
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BankTabItem } from './BankTabItem';
import BankInfo from './BankInfo';
import TransactionsTable from './TransactionsTable';
import { Pagination } from './Pagination';

const RecentTransactions = ({
  accounts,
  transactions = [],
  appwriteItemId,
  page = 1,
}: RecentTransactionsProps) => {

  // ✅ Track currently selected tab
  const [selectedAccountId, setSelectedAccountId] = React.useState(appwriteItemId);
  const rowsPerPage=10;
  const totalPages=Math.ceil(transactions.length/rowsPerPage)

  const indexOfLastTransaction=page*rowsPerPage;
  const indexOfFirstTransaction=indexOfLastTransaction-rowsPerPage

  const currentTransactions=transactions.slice(
    indexOfFirstTransaction, indexOfLastTransaction
  )
  return (
    <section className='recent-transactions'>
      <header className='flex items-center justify-between'>
        <h2 className='recent-transactions-label'>
          Recent Transactions
        </h2>

        {/* ✅ Pass selected tab ID */}
        <Link
          href={`/transaction-history/?id=${selectedAccountId}&page=1`}
          className='view-all-btn'
          style={{ padding: '0.5rem', backgroundColor: '#39adff', color:"white" }}
        >
          View All
        </Link>
      </header>

      <Tabs
        value={selectedAccountId}
        onValueChange={setSelectedAccountId}
        className="w-full"
      >
        <TabsList
          className='recent-transactions-tablist'
          style={{ padding: '0.5rem' }}
        >
          {accounts.map((account: Account) => (
            <TabsTrigger
              key={account.id}
              value={account.appwriteItemId}
            >
              <BankTabItem
                account={account}
                appwriteItemId={selectedAccountId}
              />
            </TabsTrigger>
          ))}
        </TabsList>

        {accounts.map((account: Account) => (
          <TabsContent
            key={account.id}
            value={account.appwriteItemId}
            className='space-y-4'
          >
            <BankInfo
              account={account}
              appwriteItemId={selectedAccountId}
              type="full"
            />

            <TransactionsTable
              transactions={currentTransactions }
            />
            <Pagination totalPages={totalPages} page={page}  />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default RecentTransactions;
