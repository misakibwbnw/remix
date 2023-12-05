import React from 'react';
import { Link, NavLink } from '@remix-run/react';
import { HomeIcon } from '@heroicons/react/24/outline';

export function Sidebar(props: any): JSX.Element {
  return (
    <div className={`${props.open ? 'block' : 'hidden'}`}>
      <div className="relative hidden h-screen my-4 ml-4 shadow-lg lg:block w-80">
        <div className="h-full bg-white rounded-2xl dark:bg-gray-700">
          <div className="flex items-center justify-center pt-6">
            <Link to={'/'}>
              <HomeIcon className="h-5 w-5" />
            </Link>
          </div>
          <nav className="mt-6">
            <div>
              <NavLink
                to={'/'}
                className="flex items-center justify-start w-full p-4 my-2 font-thin text-gray-500 uppercase transition-colors duration-200 dark:text-gray-200 hover:text-blue-500 [&.active]:text-blue-500 [&.active]:border-r-4 [&.active]:border-blue-500 [&.active]:bg-gradient-to-r [&.active]:from-white [&.active]:to-blue-100 [&.active]:dark:from-gray-700 [&.active]:dark:to-gray-800"
              >
                <span className="mx-4 text-sm font-normal">Dashboard</span>
              </NavLink>
              <NavLink
                to={'/contents'}
                className="flex items-center justify-start w-full p-4 my-2 font-thin text-gray-500 uppercase transition-colors duration-200 dark:text-gray-200 hover:text-blue-500 [&.active]:text-blue-500 [&.active]:border-r-4 [&.active]:border-blue-500 [&.active]:bg-gradient-to-r [&.active]:from-white [&.active]:to-blue-100 [&.active]:dark:from-gray-700 [&.active]:dark:to-gray-800"
              >
                <span className="mx-4 text-sm font-normal">Contents</span>
              </NavLink>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
