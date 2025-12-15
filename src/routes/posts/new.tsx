import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createPost } from "@/lib/posts-client"
import { type CreatePostInput, createPostSchema } from "@/lib/posts-schema"
import { useAppForm } from "@/lib/react-form"
import { postsQueryOptions } from "@/lib/react-query"

export const Route = createFileRoute("/posts/new")({
  component: NewPost,
  loader: async () => {
    return { crumb: { label: "New", url: "/posts/new" } }
  },
})

function NewPost() {
  const navigate = useNavigate()
  const queryClient = Route.useRouteContext().queryClient

  const form = useAppForm({
    defaultValues: {
      title: "",
      content: "",
      author: "",
    } satisfies CreatePostInput,
    validators: {
      onSubmit: createPostSchema,
    },
    onSubmit: async ({ value }) => {
      const newPost = await createPost(value)
      void queryClient.invalidateQueries(postsQueryOptions)
      navigate({ to: "/posts/$id", params: { id: newPost.id } })
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <form.AppField name="title">
            {(field) => <field.TextField label="Title" placeholder="Enter post title" />}
          </form.AppField>

          <form.AppField name="content">
            {(field) => <field.TextareaField label="Content" placeholder="Enter post content" rows={10} />}
          </form.AppField>

          <form.AppField name="author">
            {(field) => <field.TextField label="Author" placeholder="Enter author name" />}
          </form.AppField>

          <div className="flex gap-2">
            <Button type="submit" disabled={form.state.isSubmitting}>
              {form.state.isSubmitting ? "Creating..." : "Create Post"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate({ to: "/posts" })}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
