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

export default function Mypage(): JSX.Element {
  return <div>マイページ</div>;
}
