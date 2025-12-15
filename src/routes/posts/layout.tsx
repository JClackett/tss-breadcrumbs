import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/posts")({
  component: Outlet,
  pendingComponent: () => null,
  loader: () => {
    return { crumb: { label: "Posts", url: "/posts" } }
  },
})
