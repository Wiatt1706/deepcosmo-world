import React from "react";
import Guys from "@/components/World/guys";

export default async function land({ params }) {
  return (
    <section className="flex flex-col items-center justify-center">
      <Guys />
    </section>
  );
}
