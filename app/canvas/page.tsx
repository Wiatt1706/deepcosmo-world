import RenderCanvas from "@/components/canvas/RenderCanvas";

export default async function communityPage() {
  return (
    <RenderCanvas
      width={2000}
      height={2000}
      lightIntensity={0.6}
      mouseSensitivity={2}
    />
  );
}
