"use client"
import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import { IoArrowForwardOutline } from "react-icons/io5";
import vercel from "@/assets/images/vercel-logo.png"
import Image from 'next/image';
import { useMagic } from '@/hooks/MagicProvider';
import { logout } from '@/utils/common';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';

const Navbar = () => {
  const { magic } = useMagic();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasTicket, setHasTicket] = useState(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (magic) {
        try {
          const isLoggedIn = await magic.user.isLoggedIn();
          setIsLoggedIn(isLoggedIn);

          if (isLoggedIn) {
            const metadata = await magic.user.getMetadata();
            if (metadata.issuer) {
              const { data } = await supabase
                .from('userinfo')
                .select('*')
                .eq('user_id', metadata.issuer)
                .single();

              setHasTicket(!!data);
            }
          }
        } catch (error) {
          console.error("Error checking user status:", error);
        }
      }
    };

    checkUserStatus();
  }, [magic]);

 

  const handleGetTicket = () => {
    if (hasTicket) {
      router.push('/dashBoard');
    } else {
      router.push('/ticketForm');
    }
  };

  return (
    <div className="text-gray-600 body-font">
    <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
      <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <h1 className='font-bold text-xl'>Next.js</h1>
          <div className='border-2 border-black   text-[10px] font-semibold rounded-md'>
              CONFG24
          </div>
  
      </a>
      <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center gap-2">
        <Link href={"https://vercel.com/frameworks/nextjs?utm_source=next_site&utm_medium=web&utm_campaign=next_on_vercel_nav_cta"}>
        <div className='flex gap-2 items-center'>
  
        <p>Next.js on </p>
        <Image src={vercel} alt="Vercel" width={20} height={20}/>
        </div>
        </Link>
        <Link href={"/"}>Home</Link>
        
         
          <Link href={"/ticketForm"}>
            <div className='bg-[#0057ff] text-white text-lg py-2 px-8 border flex items-center gap-2 font-semibold'>
              <button className='' onClick={handleGetTicket}>Get Ticket</button>
              <IoArrowForwardOutline />
            </div>
          </Link>
      </nav>
      
    </div>
  </div>
  )
}

export default Navbar
