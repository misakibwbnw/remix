import React, { useState } from 'react';
import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import {
  Form,
  Link,
  useLoaderData,
  useFetcher,
  useFetchers,
  useActionData,
} from '@remix-run/react';
import invariant from 'tiny-invariant';
import { getContent, updateContent, deleteContent } from '../data';
import delay from '../lib/delay';
import DeleteAlert from '~/components/DeleteAlert';
import ContentForm from '~/components/ContentForm';
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
  // const title = formData.get('title');

  switch (intent) {
    case 'save': {
      const title = formData.get('title');
      const text = formData.get('text');
      const content = await updateContent(params.id, { title, text });
      return json({ ok: true });
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
  const isProcesseing = fetcher.state !== 'idle';

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
              className="mr-4 text-sm underline text-sky-600"
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
                {!isProcesseing ? '非公開' : <ArrowPathIcon className="h-5 w-5 animate-spin" />}
              </button>
            ) : (
              <button
                type="submit"
                name="intent"
                value="publish"
                className="py-2 px-8 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
              >
                {/* 公開 */}
                {!isProcesseing ? '公開' : <ArrowPathIcon className="h-5 w-5 animate-spin" />}
              </button>
            )}
          </fetcher.Form>
        </div>
      </div>

      <div className="flex gap-8 bg-white p-6">
        <ContentForm content={content} />

        <div className={open ? 'block' : 'hidden'}>
          <DeleteAlert handleClose={handleClose} />
        </div>

        {/* 右サイドパネル */}
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
          <span className="text-xs text-slate-500">作成者</span>
          <div className="mt-1 mb-4">{content.author}</div>
          <span className="text-xs text-slate-500">最終更新日時</span>
          <div className="mt-1 mb-4">{content.updatedAt}</div>
          <span className="text-xs text-slate-500">作成日時</span>
          <div className="mt-1 mb-4">{content.createdAt}</div>
        </div>
      </div>
    </>
  );
}
