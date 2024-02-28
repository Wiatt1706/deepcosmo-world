import { Button } from "@nextui-org/button";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
} from "@nextui-org/react";
import { Html } from "@react-three/drei";

export function HtmlTooltip({ children, ...props }) {
  return (
    <Html
      {...props}
      rotation-x={-Math.PI / 2}
      style={{ userSelect: "none" }}
      occlude="raycast"
      transform
      portal
    >
      <Card className="bg-[#18181b]">
        <CardHeader className="flex gap-3 mt-2 mx-2">
          <i className="w-4 h-4 bg-[#ff5f59] rounded-full" />
          <i className="w-4 h-4 bg-[#ffbe2c] rounded-full" />
          <i className="w-4 h-4 bg-[#2aca44] rounded-full" />
        </CardHeader>
        <CardBody className="p-0">{children}</CardBody>
        <Divider />
        <CardFooter>
        
        </CardFooter>
      </Card>
    </Html>
  );
}
