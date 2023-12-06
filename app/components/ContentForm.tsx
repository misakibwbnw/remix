import { useFetcher } from '@remix-run/react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export default function ContentForm({ content }): JSX.Element {
  // const { id } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const isSubimiting = fetcher.state !== 'idle';

  return (
    <fetcher.Form method="post" className="flex-1">
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
          {!isSubimiting ? '保存' : <ArrowPathIcon className="h-5 w-5 animate-spin" />}
        </button>
      </div>
    </fetcher.Form>
  );
}
