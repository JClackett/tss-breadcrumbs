import { createFileRoute } from "@tanstack/react-router"
import { json } from "@tanstack/react-start"
import { createPostSchema } from "@/lib/posts-schema"
import { createPost, readPosts } from "@/server/posts-api"

export const Route = createFileRoute("/api/posts/")({
  server: {
    handlers: {
      GET: async () => {
        const posts = await readPosts()
        return json(posts)
      },
      POST: async ({ request }) => {
        const body = await request.json()
        const validationResult = createPostSchema.safeParse(body)

        if (!validationResult.success)
          return json({ error: "Validation failed", details: validationResult.error.issues }, { status: 400 })

        const post = await createPost(validationResult.data)
        return json(post, { status: 201 })
      },
    },
  },
})
