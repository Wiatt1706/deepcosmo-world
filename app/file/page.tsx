import World from "@/components/World/world";
import { ToolView } from "@/components/comment-editor/tool";

export default function FilePage() {
  return (
    <div className="w-full h-full">
      <World />
      <ToolView />
    </div>
  );
}
