"use client";
import { Button } from "@nextui-org/button";
import React, { useState } from "react";
export const ToolView = () => {
  return (
    <div className={"bottom-tool"}>
      <Button className="max-w-xs w-full py-2 mt-3" color="primary">
        按钮
      </Button>
    </div>
  );
};
