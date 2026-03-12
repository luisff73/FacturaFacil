// import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut, auth } from '@/auth';

export default async function SideNav() {
  const session = await auth();

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-gray-100 dark:bg-gray-900">
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks user={session?.user as any} />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/' });
          }}
        >
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-100 dark:bg-gray-800 p-3 text-sm font-medium hover:bg-green-200 dark:hover:bg-grey-700 hover:text-green-600 dark:text-white md:flex-none md:justify-start md:p-2 md:px-3">

            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}