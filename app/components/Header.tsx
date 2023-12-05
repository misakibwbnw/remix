import React from 'react';
import { Link } from '@remix-run/react';
import { Bars3Icon } from '@heroicons/react/24/outline';

export function Header(props): JSX.Element {
  return (
    <header className=" items-center w-full h-16 bg-white shadow-lg dark:bg-gray-700 rounded-2xl">
      <div className="relative flex flex-col justify-center h-full px-3 mx-auto flex-center">
        <div className="relative flex items-center w-full pl-1 lg:max-w-68 sm:pr-2 sm:ml-0">
          <div className="container relative left-0 flex w-3/4 gap-2">
            <div className="flex items-center justify-center h-10 w-10">
              <button type="button" onClick={props.toggleOpen}>
                <Bars3Icon className="h-5 w-5" />
              </button>
            </div>
            {/* <div className="relative flex items-center w-full lg:w-64">
              <div className="absolute z-50 flex items-center justify-center block w-auto h-10 p-3 pr-2 text-sm text-gray-500 uppercase cursor-pointer sm:hidden">
                <svg
                  fill="none"
                  className="relative w-5 h-5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <svg
                className="absolute left-0 z-20 hidden w-4 h-4 ml-4 text-gray-500 pointer-events-none fill-current sm:block"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
              </svg>
              <input
                type="text"
                className="block w-full py-1.5 pl-10 pr-4 leading-normal rounded-2xl focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ring-opacity-90 bg-gray-100 dark:bg-gray-800 text-gray-400 aa-input"
                placeholder="Search"
              />
            </div> */}
          </div>
          <div className="relative flex items-center justify-end w-1/4 p-1 ml-5 mr-4 sm:mr-0 sm:right-auto">
            <Link to={'/mypage'} className="relative block">
              <img
                alt="profil"
                src="/images/person/1.png"
                className="mx-auto object-cover rounded-full h-10 w-10 "
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
