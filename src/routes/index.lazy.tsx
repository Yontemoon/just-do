import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return <div className="underline">Hello world!</div>;
}
