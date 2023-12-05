import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  Outlet,
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
  Link,
} from '@remix-run/react';
import stylesheet from '~/tailwind.css';
import type { LinksFunction } from '@remix-run/node';
import { Sidebar } from '~/components/Sidebar';
import { Header } from '~/components/Header';
// import { Main } from '~/components/Main';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: stylesheet }];

export default function App(): JSX.Element {
  const [openSideBar, setOpen] = useState(false);
  const toggleSideBar = () => {
    setOpen(!openSideBar);
  };

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <main className="relative h-screen overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-2xl">
          <div className="flex items-start justify-between">
            <Sidebar open={openSideBar} />
            <div className="flex flex-col w-full pl-0 md:p-4 md:space-y-4">
              <Header toggleOpen={toggleSideBar} />

              <Outlet />
            </div>
          </div>
        </main>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
