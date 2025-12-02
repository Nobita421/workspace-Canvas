import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Thread, Comment } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapThreadFromDB = (data: any): Thread => ({
  id: data.id,
  type: data.type,
  x: data.x,
  y: data.y,
  width: data.width,
  height: data.height,
  title: data.title,
  content: data.content,
  author: data.author_id,
  sentiment: data.sentiment,
  locked: data.locked,
  zIndex: data.z_index,
  color: data.color,
  imageUrl: data.image_url,
  tags: data.tags,
  createdAt: data.created_at,
  connectedTo: [],
  playgroundId: data.canvas_id,
  metadata: data.metadata
});

export const mapThreadToDB = (thread: Partial<Thread>, canvasId: string, userId: string) => {
  const {
    id, type, x, y, width, height, title, content,
    sentiment, locked, zIndex, color, imageUrl, tags, metadata
  } = thread;

  return {
    id,
    canvas_id: canvasId,
    type,
    x,
    y,
    width,
    height,
    title,
    content,
    author_id: userId,
    sentiment,
    locked,
    z_index: zIndex,
    color,
    image_url: imageUrl,
    tags,
    metadata
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapCommentFromDB = (data: any): Comment => ({
  text: data.content,
  author: data.author_id,
  authorName: 'Unknown',
  createdAt: data.created_at
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapCommentToDB = (comment: any, threadId: string) => ({
  thread_id: threadId,
  content: comment.text,
  author_id: comment.author,
  created_at: comment.createdAt
});
