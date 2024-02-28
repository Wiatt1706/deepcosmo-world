import World from "@/components/World/world";
import { ToolView } from "@/components/comment-editor/tool";
import { Navbar } from "@/components/comment-editor/navbar";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center">
      <Navbar />

      <World />
      <ToolView />
    </section>
  );
}
