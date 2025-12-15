import { queryOptions } from "@tanstack/react-query"
import { getPost, getPosts } from "./posts-client"

// Query Options
export const postsQueryOptions = queryOptions({
  queryKey: ["posts"],
  queryFn: getPosts,
})

export const postQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["posts", id],
    queryFn: () => getPost(id),
  })
