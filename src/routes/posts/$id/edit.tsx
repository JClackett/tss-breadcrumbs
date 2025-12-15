import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { updatePost } from "@/lib/posts-client"
import { createPostSchema } from "@/lib/posts-schema"
import { useAppForm } from "@/lib/react-form"
import { postQueryOptions, postsQueryOptions } from "@/lib/react-query"

export const Route = createFileRoute("/posts/$id/edit")({
  component: EditPost,
  loader: async ({ params }) => {
    return { crumb: { label: "Edit", url: `/posts/${params.id}/edit` } }
  },
})

function EditPost() {
  const { id } = Route.useParams()
  const { data: post } = useSuspenseQuery(postQueryOptions(id))
  const queryClient = Route.useRouteContext().queryClient
  const router = useRouter()
  const form = useAppForm({
    defaultValues: {
      title: post.title,
      content: post.content,
      author: post.author,
    },
    validators: {
      onSubmit: createPostSchema,
    },
    onSubmit: async ({ value }) => {
      await updatePost(id, value)
      form.reset()
      void queryClient.invalidateQueries(postQueryOptions(id))
      void queryClient.invalidateQueries(postsQueryOptions)
      toast.success("Post updated successfully")
      router.invalidate()
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Post</CardTitle>
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
              {form.state.isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            <form.Subscribe selector={(s) => s.isDefaultValue}>
              {(isDefaultValue) => (
                <Button type="button" disabled={isDefaultValue} variant="outline" onClick={() => form.reset()}>
                  Cancel
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
