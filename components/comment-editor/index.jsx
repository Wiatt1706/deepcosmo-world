"use client";
import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Textarea,
} from "@nextui-org/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ChevronDownIcon } from "@/components/utils/icons";

export const ContentEditor = ({ text }) => {
  return (
    <>
      <SyntaxHighlighter
        showLineNumbers
        showInlineLineNumbers
        language="javascript"
        style={vscDarkPlus}
      >
        {text}
      </SyntaxHighlighter>
    </>
  );
};
