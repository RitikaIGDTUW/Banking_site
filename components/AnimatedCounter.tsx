"use client"
import React from 'react'
import CountUp from 'react-countup'

const AnimatedCounter = ({amount}:{amount:number}) => {
  return (
    <div className='w-full'>
        <CountUp        
        prefix="$"
        duration={2}
        decimals={2}
        decimal='.'
         end={amount}/>
    </div>
  )
}

export default AnimatedCounter