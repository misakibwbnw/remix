import { matchSorter } from "match-sorter";
// @ts-expect-error - no types, but it's a tiny function
import sortBy from "sort-by";
import invariant from "tiny-invariant";
import dayjs from "dayjs";
import delay from './lib/delay';

export interface ContentMutation {
  id?: number;
  title?: string;
  text?: string;
  author?: string;
  status?: string
};
export type ContentRecord = ContentMutation & {
  id: number;
  status: string
  createdAt: string;
  updatedAt: string;
};

const fakeContents = {
  records: {} as Record<string, ContentRecord>,

  async getAll(): Promise<ContentRecord[]> {
    return Object.keys(fakeContents.records)
      .map((key) => fakeContents.records[key])
      .sort(sortBy("-createdAt"));
  },

  async get(id: string): Promise<ContentRecord | null> {
    return fakeContents.records[id] || null;
  },

  async create(values: ContentMutation): Promise<ContentRecord> {
    const id = values.id || Object.keys(fakeContents.records).length + 1;
    const createdAt = dayjs(new Date()).format('YYYY/MM/DD HH:mm:ss')
    const newContent = { id, createdAt, updatedAt: createdAt, status: "配信停止", ...values };
    fakeContents.records[id] = newContent;

    return newContent;
  },

  async set(id: string, values: ContentMutation): Promise<ContentRecord> {
    const contact = await fakeContents.get(id);
    invariant(contact, `No contact found for ${id}`);
    const updatedAt = dayjs(new Date()).format('YYYY/MM/DD HH:mm:ss')
    const updatedContent = { ...contact, ...values, updatedAt };
    fakeContents.records[id] = updatedContent;
    return updatedContent;
  },

  destroy(id: string): null {
    delete fakeContents.records[id];
    return null;
  },
};

export async function getContents(query?: string | null): Promise<ContentRecord[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  let contacts = await fakeContents.getAll();
  if (query) {
    contacts = matchSorter(contacts, query, {
      keys: ["title", "text"],
    });
  }
  return contacts;
}

export async function createEmptyContent(author: string): Promise<ContentRecord> {
  const content = await fakeContents.create({author});
  return content;
}

export async function getContent(id: string): Promise<ContentRecord | null> {
  return await fakeContents.get(id);
}

export async function updateContent(id: string, updates: ContentMutation): Promise<ContentRecord> {
  const content = await fakeContents.get(id);
  if (content === null) {
    throw new Error(`No content found for ${id}`);
  }
  fakeContents.set(id, { ...content, ...updates });
  await delay();
  return content;
}


export async function deleteContent(id: string): Promise<void> {
  await delay();
  fakeContents.destroy(id);
}

const dummyData = [
  {
    title: "サンプルタイトル",
    text: "サンプルテキスト",
    author: "山田太郎",
    status: "配信停止",
    createdAt: "2023/12/01 16:00:00"
  },
  {
    title: "ダミータイトル",
    text: "ダミーテキスト",
    author: "佐藤花子",
    status: "配信中",
    createdAt: "2023/12/01 16:00:00"
  }
]

// テータの生成
for(const [index, value] of dummyData.entries() ) {
  fakeContents.create({
    ...value,
    id: index + 1,
  });
}
