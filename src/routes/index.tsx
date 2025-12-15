import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <div className="space-y-4">
      <h1 className="font-bold text-3xl">Hello World</h1>
      <p className="text-muted-foreground">This is a demo of TanStack Start and using breadcrumbs</p>
      <Button variant="outline" render={<Link to="/posts" />} nativeButton={false}>
        View posts
      </Button>
    </div>
  )
}
