
import { User } from '@/app/lib/definitions';
import { UpdateUser, DeleteUser } from '@/app/ui/users/buttons';

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
                    <div className="mb-2 flex items-center">
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
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6 dark:text-gray-200">
                  Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium dark:text-gray-200">
                  Email
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
                  className="w-full border-b dark:border-gray-700 py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <p className="dark:text-gray-200">{user.name}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 dark:text-gray-200">
                    {user.email}
                  </td>
                  <td className="flex justify-end gap-2 whitespace-nowrap px-6 py-4 text-sm">
                    <UpdateUser id={user.id} />
                    <DeleteUser id={user.id} />
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
