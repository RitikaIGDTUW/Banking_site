import React from 'react'
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableFooter, TableRow} from "@/components/ui/table"
import { cn, formatAmount, formatDateTime, getTransactionStatus, removeSpecialCharacters } from '@/lib/utils'
import { transactionCategoryStyles } from '@/constants'

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  const key =
    category && category in transactionCategoryStyles
      ? (category as keyof typeof transactionCategoryStyles)
      : 'default';

  const {
    borderColor,
    backgroundColor,
    textColor,
    chipBackgroundColor,
  } = transactionCategoryStyles[key];

  return (
    <div className={cn('category-badge', borderColor, chipBackgroundColor)} style={{padding:'0.3rem'}}>
      <div className={cn('size-2 rounded-full', backgroundColor)} />
      <p className={cn('text-[12px] font-medium', textColor)}>
        {category || 'NULL'}
      </p>
    </div>
  );
};


const TransactionsTable = ({transactions}:TransactionTableProps) => {
  return (
     <Table style={{padding:'0.5rem'}}>
      <TableHeader className="bg-[#f9fafb]">
        <TableRow>
          <TableHead className="px-2">Transaction</TableHead>
          <TableHead className="px-2">Amount</TableHead>
          <TableHead className="px-2">Status</TableHead>
          <TableHead className="px-2">Date</TableHead>
          <TableHead className="px-2 max-md:hidden">Channel</TableHead>
          <TableHead className="px-2 max-md:hidden">Category</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody style={{backgroundColor:'#e5ffff'}}>
        {transactions.map((t:Transaction)=>{
            const status=getTransactionStatus(new Date(t.date))
            const amount=formatAmount(t.amount)
            const isDebit=t.type==='debit';
            const isCredit=t.type==='credit';
            return (
                <TableRow
                  key={t.id}
                  style={{
                    backgroundColor:
                      t.amount < 0 ? '#fff4f3' : '#f5fff3', // Light pink for negative, light green for positive
                  }}
                >
                    <TableCell className="max-full pl-2 pr-10" style={{padding:'0.5rem', paddingTop:'1.5rem', paddingBottom:'1.5rem'}}>
                <div className="flex items-center gap-3">
                  <h1 className="text-14 truncate font-semibold text-[#344054]" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                    {removeSpecialCharacters(t.name)}
                  </h1>
                </div>
              </TableCell>
                     <TableCell className={`pl-2 pr-10 font-semibold ${
                isDebit || amount[0] === '-' ?
                  'text-[#f04438]'
                  : 'text-[#039855]'
              }`} style={{paddingLeft:'0.5rem', paddingRight:'0.5rem'}}>
                {isDebit ? `-${amount}` : isCredit ? amount : amount}
              </TableCell>

              <TableCell className="pl-2 pr-10" style={{paddingLeft:'0.5rem', paddingRight:'0.5rem'}}>
                <CategoryBadge category={status} /> 
              </TableCell>

              <TableCell className="min-w-32 pl-2 pr-10" style={{paddingLeft:'0.5rem', paddingRight:'0.5rem'}}>
                {formatDateTime(new Date(t.date)).dateTime}
              </TableCell>

              <TableCell className="pl-2 pr-10 capitalize min-w-24" style={{paddingLeft:'0.5rem'}}>
               {t.paymentChannel}
              </TableCell>

              <TableCell className="pl-2 pr-10 max-md:hidden" style={{ paddingRight:'0.2rem'}}>
               <CategoryBadge category={t.category} /> 
              </TableCell>
                </TableRow>
            )
        })}
      </TableBody>
    </Table>
  )
}

export default TransactionsTable