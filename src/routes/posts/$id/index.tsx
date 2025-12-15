import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { deletePost } from "@/lib/posts-client"
import { postQueryOptions, postsQueryOptions } from "@/lib/react-query"

export const Route = createFileRoute("/posts/$id/")({
  component: PostDetail,
})

function PostDetail() {
  const { id } = Route.useParams()
  const { data: post } = useSuspenseQuery(postQueryOptions(id))
  const navigate = useNavigate()
  const queryClient = Route.useRouteContext().queryClient

  const deleteMutation = useMutation({
    mutationFn: () => deletePost(id),
    onSuccess: async () => {
      void queryClient.invalidateQueries(postsQueryOptions)
      navigate({ to: "/posts" })
      toast.success("Post deleted successfully")
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-lg">{post.content}</p>
          <div className="text-muted-foreground text-sm">
            <p>Author: {post.author}</p>
            <p>Created: {post.createdAt}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <AlertDialog>
          <AlertDialogTrigger render={<Button type="button" variant="destructive" />} disabled={deleteMutation.isPending}>
            Delete
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this post?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={deleteMutation.isPending}
                variant="destructive"
                onClick={() => deleteMutation.mutate()}
              >
                {deleteMutation.isPending ? "Deleting..." : "Confirm"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}
