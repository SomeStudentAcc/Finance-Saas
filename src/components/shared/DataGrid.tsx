'use client'
import { UseGetSummary } from '@/app/features/summary/api/use-get-summary'
import { formatDateRange } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import DataCard from './DataCard'

export default function DataGrid() {
    const {data} = UseGetSummary()
    const params = useSearchParams()
    const to = params.get('to') || undefined
    const from = params.get('from') || undefined

    

    const dateRangeLabel = formatDateRange({to, from})
  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8'>
        <DataCard
        title={'Remaining'}
        value={data?.remainingAmount}
        percentageChange={data?.remainingChange}
        variant='default'
        dateRange={dateRangeLabel}
        />
        <DataCard
        title={'Income'}
        value={data?.incomeAmount}
        percentageChange={data?.incomeChange}
        variant='default'
        dateRange={dateRangeLabel}
        />
        <DataCard
        title={'Expenses'}
        value={data?.expensesAmount}
        percentageChange={data?.expensesChange}
        variant='default'
        dateRange={dateRangeLabel}
        />
    </div>
  )
}
