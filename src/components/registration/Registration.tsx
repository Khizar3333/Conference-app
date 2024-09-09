"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import showToast from '@/utils/showToast';
import { useMagic } from '@/hooks/MagicProvider';
import supabase from '@/lib/supabase';

const Registration = () => {
  const [firstname, setFirstname] = useState<string>('');
  const [lastname, setLastname] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [jobtitle, setJobtitle] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [nextjsexpr, setNextjsexpr] = useState<string>('');
  const [ticketType, setTicketType] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { magic } = useMagic();

  useEffect(() => {
    const checkExistingTicket = async () => {
      if (!magic) return;

      try {
        const metadata = await magic.user.getMetadata();
        if (!metadata.issuer) {
          router.push('/login');
          return;
        }

        const { data, error } = await supabase
          .from('userinfo')
          .select('*')
          .eq('user_id', metadata.issuer)
          .single();

        if (data) {
          // User already has a ticket, redirect to dashboard
          router.push('/dashBoard');
        } else {
          // User doesn't have a ticket, allow form to be displayed
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking existing ticket:', error);
        setIsLoading(false);
      }
    };

    checkExistingTicket();
  }, [magic, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!magic) {
        throw new Error('Magic instance is not available');
      }

      const metadata = await magic.user.getMetadata();
      if (!metadata.issuer) {
        throw new Error('User is not authenticated');
      }

      const { data, error } = await supabase
        .from('userinfo')
        .insert({
          user_id: metadata.issuer,
          firstname,
          lastname,
          email,
          jobtitle,
          company,
          website,
          message,
          nextjsexpr,
          ticket_type: ticketType,
        });

      if (error) {
        throw error;
      }

      showToast({ message: 'Ticket created successfully! Redirecting to dashboard...', type: 'success' });
      router.push('/dashBoard');

    } catch (error) {
      console.error('Error inserting data:', error);
      setError('Failed to create ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="text-gray-600 body-font relative">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col text-center w-full mb-12">
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
            Get Your Ticket
          </h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
            Please fill out the form below to get your ticket for the event.
          </p>
        </div>

        <div className="lg:w-1/2 md:w-2/3 mx-auto mb-12">
          <div className="flex flex-wrap -m-2">
            <div className="p-2 w-full">
              <div className="relative">
                <p className="leading-7 text-sm text-gray-600 mb-4">Select Ticket Type</p>
                <div className="space-x-4">
                  <label className="inline-flex items-center border">
                    <input
                      type="radio"
                      name="ticketType"
                      value="virtual"
                      checked={ticketType === 'virtual'}
                      onChange={(e) => setTicketType(e.target.value)}
                      className="form-radio text-indigo-600"
                    />
                    <span className="ml-2">Virtual Ticket</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="ticketType"
                      value="in_person"
                      checked={ticketType === 'in_person'}
                      onChange={(e) => setTicketType(e.target.value)}
                      className="form-radio text-indigo-600"
                    />
                    <span className="ml-2">In-Person</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 md:w-2/3 mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-wrap -m-2">
            <div className="p-2 w-1/2">
              <div className="relative">
                <label htmlFor="firstname" className="leading-7 text-sm text-gray-600">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
            </div>
            <div className="p-2 w-1/2">
              <div className="relative">
                <label htmlFor="lastname" className="leading-7 text-sm text-gray-600">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
            </div>
            <div className="p-2 w-1/2">
              <div className="relative">
                <label htmlFor="email" className="leading-7 text-sm text-gray-600">
                  Work Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
            </div>
            <div className="p-2 w-1/2">
              <div className="relative">
                <label htmlFor="jobtitle" className="leading-7 text-sm text-gray-600">
                  Job Title
                </label>
                <select
                  id="jobtitle"
                  name="jobtitle"
                  value={jobtitle}
                  onChange={(e) => setJobtitle(e.target.value)}
                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                >
                  <option value="">Select an option</option>
                  <option value="Engineering lead">Engineering lead</option>
                  <option value="Engineering director">Engineering director</option>
                  <option value="Software engineer">Software engineer</option>
                  <option value="Designer">Designer</option>
                  <option value="Product manager">Product manager</option>
                </select>
              </div>
            </div>
            <div className="p-2 w-1/2">
              <div className="relative">
                <label htmlFor="company" className="leading-7 text-sm text-gray-600">
                  Company Name
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
            </div>
            <div className="p-2 w-1/2">
              <div className="relative">
                <label htmlFor="website" className="leading-7 text-sm text-gray-600">
                  Company Website
                </label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
            </div>
            <div className="p-2 w-1/2">
              <div className="relative">
                <label htmlFor="message" className="leading-7 text-sm text-gray-600">
                  What are you looking forward to learning about Next.js?
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                />
              </div>
            </div>
            <div className="p-2 w-1/2">
              <div className="relative">
                <label htmlFor="nextjsexpr" className="leading-7 text-sm text-gray-600">
                  Where are you in your Next.js experience?
                </label>
                <select
                  id="nextjsexpr"
                  name="nextjsexpr"
                  value={nextjsexpr}
                  onChange={(e) => setNextjsexpr(e.target.value)}
                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                >
                  <option value="">Select an option</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="p-2 w-full">
              <button
                type="submit"
                className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
              {error && <p className="text-red-500 text-center mt-2">{error}</p>}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Registration;

