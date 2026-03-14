
import { User } from '@/app/lib/definitions';
import { UpdateUser, DeleteUser } from '@/app/ui/users/buttons';
import Image from 'next/image';

const BLOB_URL = (process.env.NEXT_PUBLIC_BLOB_URL || 'https://tqqqihkzj4uwev0c.public.blob.vercel-storage.com').replace(/"/g, '');

const getImageUrl = (image_url: string | null | undefined) => {
  if (!image_url) return '/user.png';
  if (image_url.startsWith('http') || image_url.startsWith('/')) return image_url;
  return `${BLOB_URL}/${image_url}`;
};

interface UsersTableProps {
  users: User[];
}

export default function UsersTable({ users }: UsersTableProps) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-2 md:pt-0">
          <div className="md:hidden">
            {users?.map((user) => (
              <div
                key={user.id}
                className="mb-2 w-full rounded-md bg-white dark:bg-gray-900 p-4"
              >
                <div className="flex items-center justify-between border-b dark:border-gray-700 pb-4">
                  <div>
                    <div className="mb-2 flex items-center gap-3">
                      <Image
                        src={getImageUrl(user.image_url)}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <p className="dark:text-gray-200">{user.name}</p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="flex justify-end gap-2 whitespace-nowrap px-6 py-4 text-sm">
                    <UpdateUser id={user.id} />
                    <DeleteUser id={user.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <table className="hidden min-w-full text-gray-900 dark:text-gray-200 md:table">
            <thead className="text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6 dark:text-gray-200">
                  Imagen
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6 dark:text-gray-200">
                  Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium dark:text-gray-200">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium dark:text-gray-200">
                  Tipo
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900">
              {users?.map((user) => (
                <tr
                  key={user.id}
                  className="group/row hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="whitespace-nowrap bg-white dark:bg-gray-900 py-3 pl-6 pr-3 group-first/row:rounded-tl-lg group-last/row:rounded-bl-lg">
                    <Image
                      src={getImageUrl(user.image_url)}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </td>
                  <td className="whitespace-nowrap bg-white dark:bg-gray-900 py-3 pl-6 pr-3">
                    <p className="dark:text-gray-200">{user.name}</p>
                  </td>
                  <td className="whitespace-nowrap bg-white dark:bg-gray-900 px-3 py-3 dark:text-gray-200">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap bg-white dark:bg-gray-900 px-3 py-3 dark:text-gray-200">
                    {user.type}
                  </td>
                  <td className="whitespace-nowrap bg-white dark:bg-gray-900 px-4 py-5 text-sm group-first/row:rounded-tr-lg group-last/row:rounded-br-lg">
                    <div className="flex justify-end gap-3">
                      <UpdateUser id={user.id} />
                      <DeleteUser id={user.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
