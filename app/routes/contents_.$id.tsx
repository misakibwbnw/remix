import React, { useState } from 'react';
import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, Link, useLoaderData, useFetcher } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { getContent, updateContent, deleteContent } from '../data';
import delay from '../lib/delay';
import DeleteAlert from '~/components/DeleteAlert';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.id, 'Missing contactId param');
  const content = await getContent(params.id);
  if (!content) {
    throw new Response('Not Found', { status: 404 });
  }
  return json({ content });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.id, 'Missing contactId param');
  const formData = await request.formData();
  const intent = formData.get('intent');

  switch (intent) {
    case 'save': {
      const updates = Object.fromEntries(formData);
      return redirect(`/contents`);
    }
    case 'publish': {
      const content = await updateContent(params.id, { status: '配信中' });
      return json({ ok: true });
    }
    case 'unpublish': {
      const content = await updateContent(params.id, { status: '配信停止' });
      return json({ ok: true });
    }
    case 'delete': {
      const content = await deleteContent(params.id);
      await delay();
      return redirect(`/contents`);
    }
    default: {
      throw new Error('Unexpected action');
    }
  }
};

export default function Content(): JSX.Element {
  const { content } = useLoaderData<typeof loader>();
  const [open, setOpen] = useState(false);
  const fetcher = useFetcher();
  const isDeleting = fetcher.state !== 'idle';

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (type?: string) => {
    setOpen(false);
  };

  return (
    <>
      <div className="flex justify-between">
        <Link className="underline text-sky-600 text-base" to={`/contents`}>
          ＜ 記事一覧へ戻る
        </Link>

        <div className="flex">
          <Form method="post" className="flex items-center">
            <button
              type="button"
              className="mr-4 text-sm underline text-sky-600 text-base"
              onClick={handleOpen}
            >
              記事を削除する
            </button>
          </Form>
          <fetcher.Form method="post">
            {content.status === '配信中' ? (
              <button
                type="submit"
                name="intent"
                value="unpublish"
                className="py-2 px-8 bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
              >
                {/* 非公開 */}
                {!isDeleting ? '非公開' : <ArrowPathIcon className="h-5 w-5 animate-spin" />}
              </button>
            ) : (
              <button
                type="submit"
                name="intent"
                value="publish"
                className="py-2 px-8 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
              >
                {/* 公開 */}
                {!isDeleting ? '公開' : <ArrowPathIcon className="h-5 w-5 animate-spin" />}
              </button>
            )}
          </fetcher.Form>
        </div>
      </div>

      <div className="flex gap-8 bg-white p-6">
        <Form id="contact-form" method="post" className="flex-1">
          <div className="">
            <label htmlFor="title" className="text-gray-700 mb-4">
              タイトル
              {/* <span className="text-red-500 required-dot">*</span> */}
            </label>
            <input
              type="text"
              id="title"
              className="rounded-lg  mt-2 flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              name="title"
              placeholder="記事のタイトル"
              defaultValue={content.title}
            />
          </div>

          <div className="mt-4">
            <label className="text-gray-700" htmlFor="text">
              本文
              {/* <span className="text-red-500 required-dot">*</span> */}
            </label>
            <textarea
              className="flex-1 w-full px-4 py-2 mt-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              id="text"
              placeholder="記事の本文"
              name="text"
              rows={5}
              cols={100}
              defaultValue={content.text}
            ></textarea>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <button
              type="submit"
              name="intent"
              value="save"
              className="py-2 px-4 flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
            >
              保存
            </button>
          </div>

          {/* ダイアログ */}
          {open ? (
            <div
              className="relative z-100"
              aria-labelledby="modal-title"
              role="dialog"
              aria-modal="true"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                  <div className="w-72 h-fit p-4 absolute top-0 left-0 right-0 bottom-0 m-auto bg-white shadow-lg rounded-2xl dark:bg-gray-800">
                    <div className="w-full h-full text-center">
                      <div className="flex flex-col justify-between h-full">
                        <svg
                          width="40"
                          height="40"
                          className="w-12 h-12 m-auto mt-4 text-indigo-500"
                          fill="currentColor"
                          viewBox="0 0 1792 1792"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M704 1376v-704q0-14-9-23t-23-9h-64q-14 0-23 9t-9 23v704q0 14 9 23t23 9h64q14 0 23-9t9-23zm256 0v-704q0-14-9-23t-23-9h-64q-14 0-23 9t-9 23v704q0 14 9 23t23 9h64q14 0 23-9t9-23zm256 0v-704q0-14-9-23t-23-9h-64q-14 0-23 9t-9 23v704q0 14 9 23t23 9h64q14 0 23-9t9-23zm-544-992h448l-48-117q-7-9-17-11h-317q-10 2-17 11zm928 32v64q0 14-9 23t-23 9h-96v948q0 83-47 143.5t-113 60.5h-832q-66 0-113-58.5t-47-141.5v-952h-96q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h309l70-167q15-37 54-63t79-26h320q40 0 79 26t54 63l70 167h309q14 0 23 9t9 23z"></path>
                        </svg>
                        <p className="mt-4 text-xl font-bold text-gray-800 dark:text-gray-200">
                          削除
                        </p>
                        <p className="px-6 py-2 text-xs text-gray-600 dark:text-gray-400">
                          記事を削除してよろしいですか？
                        </p>
                        <div className="grid grid-cols-2 items-center justify-between gap-4 mt-8">
                          <div>
                            <button
                              type="submit"
                              name="intent"
                              value="delete"
                              className="py-2 px-4 w-full bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
                            >
                              削除
                            </button>
                          </div>
                          <button
                            type="button"
                            className="py-2 px-4 bg-white hover:bg-gray-100 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-indigo-600 transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                            onClick={() => handleClose}
                          >
                            キャンセル
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
        </Form>
        <div className="w-64 text-sm">
          <div className="mb-4">
            {content.status === '配信中' ? (
              <span className="px-4 py-2 inline-block text-base rounded-full text-green-600 bg-green-200">
                {content.status}
              </span>
            ) : (
              <span className="px-4 py-2 inline-block text-base rounded-full text-yellow-600 bg-yellow-200">
                {content.status}
              </span>
            )}
          </div>
          <span className="">最終更新日時</span>
          <div className="mt-1 mb-4">{content.updatedAt}</div>
          <span className="">作成日時</span>
          <div className="mt-1 mb-4">{content.createdAt}</div>
        </div>
      </div>
    </>
  );
}
