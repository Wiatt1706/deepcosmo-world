"use client";
import React, { useState } from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

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
