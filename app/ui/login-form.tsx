'use client';

import { lusitana } from '@/app/ui/fonts';
import { AtSymbolIcon, KeyIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { FaGoogle, FaGithub } from 'react-icons/fa';

export default function LoginForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    
    try {
      const formData = new FormData(event.currentTarget);
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.get('email'),
        password: formData.get('password'),
      });

      if (result?.error) {
        setErrorMessage('Invalid credentials');
      } else {
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setErrorMessage('An error occurred during authentication');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please log in to continue
        </h1>
        <div className="w-full">
          {/* Email input */}
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              id="email"
              type="email"
              name="email"
              required
            />
          </div>
          
          {/* Password input */}
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              id="password"
              type="password"
              name="password"
              required
            />
          </div>

          {/* Error message */}
          {errorMessage && (
            <div className="mt-4 text-sm text-red-500">
              <ExclamationCircleIcon className="inline h-5 w-5 mr-2" />
              {errorMessage}
            </div>
          )}

          {/* Submit button */}
          <Button 
            type="submit" 
            className="mt-5 w-full"
            disabled={isPending}
          >
            {isPending ? 'Logging in...' : 'Log in'}
            <ArrowRightIcon className="ml-auto h-5 w-5" />
          </Button>

          {/* OAuth buttons */}
          <div className="mt-6 flex justify-center space-x-4">
            <Button
              type="button"
              className="flex items-center gap-2"
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            >
              <FaGoogle className="h-5 w-5" />
              <span>Sign in with Google</span>
            </Button>
            <Button
              type="button"
              className="flex items-center gap-2"
              onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
            >
              <FaGithub className="h-5 w-5" />
              <span>Sign in with GitHub</span>
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}