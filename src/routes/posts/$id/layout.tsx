import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link, Outlet } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { postQueryOptions } from "@/lib/react-query"

export const Route = createFileRoute("/posts/$id")({
  component: PostDetailLayout,
  loader: async ({ params, context }) => {
    const post = await context.queryClient.ensureQueryData(postQueryOptions(params.id))
    return { crumb: { label: post.title, url: `/posts/${params.id}` } }
  },
  notFoundComponent: () => <div>Post not found</div>,
})

function PostDetailLayout() {
  const { id } = Route.useParams()
  const { data: post } = useSuspenseQuery(postQueryOptions(id))

  return (
    <div>
      <div className="mb-6">
        <h1 className="mb-4 h-12 font-bold text-3xl">{post.title}</h1>
        <div className="flex gap-1 border-b pb-1">
          <Button
            variant="ghost"
            size="default"
            className="opacity-60 data-[status=active]:bg-muted data-[status=active]:opacity-100"
            nativeButton={false}
            render={<Link to="/posts/$id" activeOptions={{ exact: true }} params={{ id }} />}
          >
            Details
          </Button>
          <Button
            variant="ghost"
            size="default"
            className="opacity-60 data-[status=active]:bg-muted data-[status=active]:opacity-100"
            nativeButton={false}
            render={<Link to="/posts/$id/edit" params={{ id }} />}
          >
            Edit
          </Button>
        </div>
      </div>
      <Outlet />
    </div>
  )
}
