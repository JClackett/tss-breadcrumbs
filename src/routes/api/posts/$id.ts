import { createFileRoute } from "@tanstack/react-router"
import { json } from "@tanstack/react-start"
import { updatePostSchema } from "@/lib/posts-schema"
import { deletePost, getPost, updatePost } from "@/server/posts-api"

export const Route = createFileRoute("/api/posts/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const post = await getPost(params.id)
        if (!post) return json({ error: "Post not found" }, { status: 404 })
        return json(post)
      },
      PATCH: async ({ params, request }) => {
        const body = await request.json()
        const validationResult = updatePostSchema.safeParse(body)
        if (!validationResult.success)
          return json({ error: "Validation failed", details: validationResult.error.issues }, { status: 400 })
        const updatedPost = await updatePost(params.id, validationResult.data)
        if (!updatedPost) return json({ error: "Post not found" }, { status: 404 })

        return json(updatedPost)
      },
      DELETE: async ({ params }) => {
        const deleted = await deletePost(params.id)
        if (!deleted) return json({ error: "Post not found" }, { status: 404 })
        return json({ success: true })
      },
    },
  },
})
