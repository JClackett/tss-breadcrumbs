import { TanStackDevtools } from "@tanstack/react-devtools"
import type { QueryClient } from "@tanstack/react-query"
import { createRootRouteWithContext, HeadContent, Link, Scripts, useMatches } from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { Fragment } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Toaster } from "@/components/ui/sonner"
import appCss from "../styles.css?url"

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TanStack Start Starter" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  notFoundComponent: () => <div className="p-4 text-center font-bold text-2xl">Page Not found</div>,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="container mx-auto space-y-4 p-4">
          <BreadCrumbs />
          <div>{children}</div>
        </div>
        <Toaster />
        <TanStackDevtools
          config={{ position: "bottom-right" }}
          plugins={[{ name: "Tanstack Router", render: <TanStackRouterDevtoolsPanel /> }]}
        />
        <Scripts />
      </body>
    </html>
  )
}

function BreadCrumbs() {
  const matches = useMatches()
  const crumbs = matches
    .map((match) => {
      const loaderData = match.loaderData as { crumb?: { label: string; url: string } } | undefined
      const crumb = loaderData?.crumb
      return crumb ? { ...crumb, id: match.id } : null
    })
    .filter((crumb): crumb is { label: string; url: string; id: string } => crumb !== null)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink render={<Link to="/" />}>Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        {crumbs.length > 0 && <BreadcrumbSeparator className="hidden md:block" />}
        {crumbs.map((crumb, i) => (
          <Fragment key={crumb.id}>
            <BreadcrumbItem>
              {i === crumbs.length - 1 ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink render={<Link to={crumb.url} />}>{crumb.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {i < crumbs.length - 1 && <BreadcrumbSeparator className="hidden md:block" />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
