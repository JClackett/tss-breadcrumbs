import { isServer } from "@tanstack/react-query"
import { notFound } from "@tanstack/react-router"
import * as z from "zod"
import { type CreatePostInput, postSchema, type UpdatePostInput } from "./posts-schema"

const API_BASE = isServer ? "http://localhost:3000/api/posts" : "/api/posts"

export async function getPosts() {
  const response = await fetch(API_BASE)
  if (!response.ok) {
    throw new Error("Failed to fetch posts")
  }
  const data = await response.json()
  return z.array(postSchema).parse(data)
}

export async function getPost(id: string) {
  const response = await fetch(`${API_BASE}/${id}`)
  if (!response.ok) {
    if (response.status === 404) throw notFound()
    throw new Error("Failed to fetch post")
  }
  const data = await response.json()
  if (!data) throw notFound()
  return postSchema.parse(data)
}

export async function createPost(input: CreatePostInput) {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!response.ok) {
    throw new Error("Failed to create post")
  }
  const data = await response.json()
  return postSchema.parse(data)
}

export async function updatePost(id: string, input: UpdatePostInput) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!response.ok) {
    if (response.status === 404) throw notFound()
    throw new Error("Failed to update post")
  }
  const data = await response.json()
  return postSchema.parse(data)
}

export async function deletePost(id: string) {
  const response = await fetch(`${API_BASE}/${id}`, { method: "DELETE" })
  if (!response.ok) {
    if (response.status === 404) throw notFound()
    throw new Error("Failed to delete post")
  }
  const data = await response.json()
  return z.object({ success: z.literal(true) }).parse(data)
}
