import { z } from "zod"

export const postSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  content: z.string().min(1, "Content is required"),
  author: z.string().min(1, "Author is required").max(100, "Author name must be less than 100 characters"),
  createdAt: z.string(),
})

export const createPostSchema = postSchema.omit({ id: true, createdAt: true })

export const updatePostSchema = createPostSchema.partial()

export type Post = z.infer<typeof postSchema>
export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>
