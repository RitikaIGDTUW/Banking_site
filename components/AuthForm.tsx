'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CustomInput from './CustomInput'
import { authFormSchema } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getLoggedInUser, signIn, signUp } from '@/lib/actions/user.actions'
import PlaidLink from './PlaidLink'



const AuthForm = ({type}:{type:string}) => {
  const router=useRouter();
  const [user, setUser]=useState(null)
  const [isLoading, setIsLoading]= useState(false);
  
  const formSchema= authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    password: "",
    firstName: "",
    lastName: "",
    address1: "",
    city: "",
    state: "",
    postalCode: "",
    dateOfBirth: "",
    ssn: "",
    },
  })
 
  // 2. Define a submit handler.
  const onSubmit=async(data: z.infer<typeof formSchema>)=> {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true)
    try{
      //sign up with appwrite and create plain link
      const userData={
        firstName:data.firstName!,
        lastName:data.lastName!,
        address1:data.address1!,
        city:data.city!,
        state:data.state!,
        postalCode:data.postalCode!,
        dateOfBirth:data.dateOfBirth!,
        ssn:data.ssn!,
        email:data.email!,
        password:data.password
      }
      if(type==='sign-up'){
        const newUser=await signUp(userData);
        if (newUser) {
          setUser(newUser);
        } else {
          // fallback: try to read the logged-in user (session may have been created server-side)
          try {
            const logged = await getLoggedInUser();
            setUser(logged as any);
          } catch (err) {
            console.error('Failed to populate user after signup', err);
          }
        }
      }
      if(type==='sign-in'){
         const response=await signIn({
          email:data.email,
          password:data.password
         })

         if(response)router.push('/')
      }
    }catch(error){
       console.log(error);
    }
    finally {
      setIsLoading(false);
    }
  }

  return (
    <section className='auth-form'>
      <header className='flex flex-col gap-5 md:gap-8'>
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
                <div className='flex flex-col gap-1 md:gap-3'>
                  <h1 className='text-24 lg:text-36 font-semibold text-gray-900'>
                    {user
                    ?'Link Account':
                    type==='sign-in'?'Sign In':'Sign Up'}
                    <p className='text-16 font-normal text-gray-600'>
                      {user?'Link your account to get started':'please enter your details'}
                    </p>
                  </h1>
                </div>
      </header>
      {/* Show Connect Bank button on the signup page after a successful signup */}
      {type === 'sign-up' && user ? (
        <div className='flex flex-col gap-4'>
          <PlaidLink user={user} variant="primary"/>
        </div>
      ) : (
        <> 
           <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" style={{padding:'0.5rem'}}>
        {type==='sign-up'&& (
          <>
          <div className='flex gap-4'>
             <CustomInput control={form.control} name='firstName' label="First Name"
          placeholder="Enter your first name"/>
          
          <CustomInput control={form.control} name='lastName' label="Last Name"
          placeholder="Enter your last name"/>
          
          </div>
          <div className='h-5'></div>
          
          <CustomInput control={form.control} name='address1' label="Address"
          placeholder="Enter your specific address"/>
          <div className='h-5'></div>
          <CustomInput control={form.control} name='city' label="City"
          placeholder="ex: Delhi"/>
          <div className='h-5'></div>
          <div className='flex gap-4'>
          <CustomInput control={form.control} name='state' label="State"
          placeholder="ex: UP"/>          
          <CustomInput control={form.control} name='postalCode' label="Postal Code"
          placeholder="Example: 1101"/>
          </div>          
          <div className='h-5'></div>
          <div className='flex gap-4'>
          <CustomInput control={form.control} name='dateOfBirth' label="Date of birth"
          placeholder="yyyy-mm-dd"/>
          
          <CustomInput control={form.control} name='ssn' label="SSN"
          placeholder="Example: 123-45-6789"/>
          </div>
          <div className='h-5'></div>
          </>
        )}
          <CustomInput control={form.control} name='email' label="Email"
          placeholder="Enter your email"/>
          <div className='h-7'></div>
          <CustomInput  control={form.control} name='password' label="Password"
          placeholder="Enter your password"/>
           <div className='h-7'></div>
           <div className='flex flex-col gap-4'>
              <Button className="border border-blue-600 bg-blue-500 text-white
              cursor-pointer
             focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
             transition" style={{padding:'0.5rem', paddingLeft:'1rem', paddingRight:'1rem'}}
              type="submit" disabled={isLoading}>
                {isLoading?(
                  <>
                  <Loader2 size={20} className='animate-spin' /> &nbsp;
                  Loading...
                  </>
                ):type==='sign-in'? 'Sign In':'Sign Up'}
             </Button>
           </div>
          
      </form>
    </Form>
    <footer className="flex justify-center gap-1 ">
      <p className='text-14 font-normal text-gray-600'>{type==='sign-in'?"Don't have an account? ":"Already have an account? "}</p>
      <Link href={type==='sign-in'? '/sign-up':'/sign-in'}
      className='form-link' style={{color:'blue'}}>
         {type==='sign-in'?'Sign Up':'Sign In'}
      </Link>
    </footer>
        </>
      )}
    </section>
  )
}

export default AuthForm