import React, { useState } from 'react';
import { json, redirect } from '@remix-run/node';
import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node';
import {
  Form,
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useFormAction,
  PrefetchPageLinks,
  useActionData,
} from '@remix-run/react';
import invariant from 'tiny-invariant';
import { getContents, createEmptyContent, deleteContent } from '~/data';
import DeleteAlert from '~/components/DeleteAlert';
import type { ContentRecord } from '~/data';

export const loader = async () => {
  const contents = await getContents();

  return json({ contents });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get('intent');

  switch (intent) {
    case 'create': {
      const content = await createEmptyContent('久手堅美咲');
      return redirect(`/contents/${content.id}`);
    }
    case 'delete': {
      const id = formData.get('deleteId');
      const errors = {
        id: id ? null : 'Title is required',
      };
      const hasErrors = Object.values(errors).some(errorMessage => errorMessage);
      if (!id) {
        return json(errors);
      }

      return redirect(`/contents`);
    }
  }
};

export default function Contents(): JSX.Element {
  const { contents } = useLoaderData<typeof loader>();
  const action = useFormAction();

  const [open, setOpen] = useState(false);
  const [contentId, setContentId] = useState<number | null>(null);

  const handleOpen = (id: number) => {
    setOpen(true);
    setContentId(id);
  };

  const handleClose = (type?: string) => {
    // if (type === 'submit') {
    //   action;
    // }
    setOpen(false);
    setContentId(null);
  };

  return (
    <div className="container px-4 mx-auto sm:px-8">
      <div className="py-8">
        <div className="flex flex-row justify-between w-full mb-1 sm:mb-0">
          <h2 className="text-2xl leading-tight">記事一覧</h2>
          <div className="text-end">
            <Form
              method="post"
              className="flex flex-col justify-center w-3/4 max-w-sm space-y-3 md:flex-row md:w-full md:space-x-3 md:space-y-0"
            >
              <button
                type="submit"
                name="intent"
                value="create"
                className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
              >
                新規作成
              </button>
            </Form>
          </div>
        </div>

        <div className="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8">
          <div className="inline-block min-w-full overflow-hidden rounded-lg shadow">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                  >
                    作成者
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                  >
                    最終更新日
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                  >
                    タイトル
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                  >
                    配信ステータス
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                  ></th>
                </tr>
              </thead>
              {contents.length ? (
                <tbody>
                  {contents.map(content => (
                    <tr key={content.id}>
                      <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                        <p className="text-gray-900 whitespace-no-wrap">{content.id}</p>
                      </td>
                      <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                        <p className="text-gray-900 whitespace-no-wrap">{content.author}</p>
                      </td>
                      <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                        <p className="text-gray-900 whitespace-no-wrap">{content.updatedAt}</p>
                      </td>
                      <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                        <p className="text-gray-900 whitespace-no-wrap">{content.title}</p>
                      </td>
                      <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                        {content.status === '配信中' ? (
                          <span className="px-4 py-2 text-base rounded-full text-green-600 bg-green-200">
                            {content.status}
                          </span>
                        ) : (
                          <span className="px-4 py-2 text-base rounded-full text-yellow-600 bg-yellow-200">
                            {content.status}
                          </span>
                        )}
                        {/* 赤いラベル */}
                        {/* <span className="px-4 py-2  text-base rounded-full text-red-600  bg-red-200 ">
                          refused
                        </span> */}
                      </td>
                      <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                        <div className=" flex gap-4">
                          <Link
                            to={`/contents/${content.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            編集
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody>
                  <tr>データがありません</tr>
                </tbody>
              )}
            </table>
            {/* ページネーション */}
            {/* <div className="flex flex-col items-center px-5 py-5 bg-white xs:flex-row xs:justify-between">
              <div className="flex items-center">
                <button
                  type="button"
                  className="w-full p-4 text-base text-gray-600 bg-white border rounded-l-xl hover:bg-gray-100"
                >
                  <svg
                    width="9"
                    fill="currentColor"
                    height="8"
                    className=""
                    viewBox="0 0 1792 1792"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z"></path>
                  </svg>
                </button>

                <button
                  type="button"
                  className="w-full px-4 py-2 text-base text-indigo-500 bg-white border-t border-b hover:bg-gray-100 "
                >
                  1
                </button>
                <button
                  type="button"
                  className="w-full px-4 py-2 text-base text-gray-600 bg-white border hover:bg-gray-100"
                >
                  2
                </button>
                <button
                  type="button"
                  className="w-full px-4 py-2 text-base text-gray-600 bg-white border-t border-b hover:bg-gray-100"
                >
                  3
                </button>
                <button
                  type="button"
                  className="w-full px-4 py-2 text-base text-gray-600 bg-white border hover:bg-gray-100"
                >
                  4
                </button>
                <button
                  type="button"
                  className="w-full p-4 text-base text-gray-600 bg-white border-t border-b border-r rounded-r-xl hover:bg-gray-100"
                >
                  <svg
                    width="9"
                    fill="currentColor"
                    height="8"
                    className=""
                    viewBox="0 0 1792 1792"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z"></path>
                  </svg>
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
