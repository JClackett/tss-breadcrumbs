import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { postsQueryOptions } from "@/lib/react-query"

export const Route = createFileRoute("/posts/")({
  component: PostsIndex,
  beforeLoad: async ({ context }) => {
    void context.queryClient.prefetchQuery(postsQueryOptions)
  },
})

function PostsIndex() {
  const { data: posts } = useSuspenseQuery(postsQueryOptions)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bold text-3xl">Posts</h1>
        <Link to="/posts/new">
          <Button>New Post</Button>
        </Link>
      </div>
      <div className="grid gap-4">
        {posts.map((post) => (
          <Link key={post.id} to="/posts/$id" params={{ id: post.id }}>
            <Card className="cursor-pointer hover:bg-muted">
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>
                  By {post.author} • {post.createdAt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3">{post.content}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
