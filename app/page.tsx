import World from "@/components/World/world";
import { ToolView } from "@/components/comment-editor/tool";

export default function Home() {
  return (
    <section className="flex items-center justify-center">
      <World />
      <ToolView />
    </section>
  );
}
