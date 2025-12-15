import { readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"
import * as z from "zod"
import { type CreatePostInput, postSchema, type UpdatePostInput } from "@/lib/posts-schema"

const postsFilePath = join(process.cwd(), "src", "server", "data", "posts.json")

export async function readPosts() {
  try {
    const data = await readFile(postsFilePath, "utf-8")
    return z.array(postSchema).parse(JSON.parse(data))
  } catch (error) {
    console.error("Error reading posts:", error)
    return []
  }
}

export async function writePosts(posts: z.infer<typeof postSchema>[]) {
  try {
    await writeFile(postsFilePath, JSON.stringify(posts, null, 2), "utf-8")
  } catch (error) {
    console.error("Error writing posts:", error)
    throw error
  }
}

export async function getPost(id: string) {
  const posts = await readPosts()
  return posts.find((post) => post.id === id)
}

export async function updatePost(id: string, updates: UpdatePostInput) {
  const posts = await readPosts()
  const index = posts.findIndex((post) => post.id === id)

  if (index === -1) return null

  posts[index] = { ...posts[index], ...updates }
  await writePosts(posts)
  return posts[index]
}

export async function createPost(post: CreatePostInput) {
  const posts = await readPosts()
  const newPost: z.infer<typeof postSchema> = {
    ...post,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString().split("T")[0],
  }
  posts.push(newPost)
  await writePosts(posts)
  return newPost
}

export async function deletePost(id: string) {
  const posts = await readPosts()
  const index = posts.findIndex((post) => post.id === id)

  if (index === -1) return false

  posts.splice(index, 1)
  await writePosts(posts)
  return true
}
