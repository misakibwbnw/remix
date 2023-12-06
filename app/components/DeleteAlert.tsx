import { useFetcher } from '@remix-run/react';

import { ArrowPathIcon } from '@heroicons/react/24/outline';

export default function DeleteAlert({ handleClose }): JSX.Element {
  const fetcher = useFetcher();
  const isSubimiting = fetcher.state !== 'idle';

  return (
    <div>
      {/* ダイアログ */}
      <div className="relative z-100" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="w-72 h-fit p-4 absolute top-0 left-0 right-0 bottom-0 m-auto bg-white shadow-lg rounded-2xl dark:bg-gray-800">
              <div className="w-full h-full text-center">
                <div className="flex flex-col justify-between h-full">
                  {!isSubimiting ? (
                    <div>
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
                          <fetcher.Form method="post">
                            <button
                              type="submit"
                              name="intent"
                              value="delete"
                              className="py-2 px-4 w-full bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
                            >
                              削除
                            </button>
                          </fetcher.Form>
                        </div>
                        <button
                          type="button"
                          className="py-2 px-4 bg-white hover:bg-gray-100 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-indigo-600 transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                          onClick={handleClose}
                        >
                          キャンセル
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <span>削除中</span>

                      <ArrowPathIcon className="h-8 w-8 animate-spin" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
