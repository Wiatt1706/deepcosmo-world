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

export const ContentEditor = () => {
  const [text, setText] = useState(""); // 文本内容
  const [loading, setLoading] = useState(false); // 加载状态
  const handleClick = (e) => {
    if (loading) {
      return;
    }
    if (!text) {
      return;
    }
    setLoading(true);
  };

  const [selectedOption, setSelectedOption] = React.useState(
    new Set(["merge"])
  );

  const descriptionsMap = {
    merge:
      "All commits from the source branch are added to the destination branch via a merge commit.",
    squash:
      "All commits from the source branch are added to the destination branch as a single commit.",
    rebase:
      "All commits from the source branch are added to the destination branch individually.",
  };

  const labelsMap = {
    merge: "Create a merge commit",
    squash: "Squash and merge",
    rebase: "Rebase and merge",
  };

  // Convert the Set to an Array and get the first value.
  const selectedOptionValue = Array.from(selectedOption)[0];


  return (
    <>
      <Textarea
        label="代码美化器"
        variant="faded"
        placeholder="拷贝你的代码复制到此处"
        className="max-w-xs"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
      <Button
        className="max-w-xs w-full py-2 mt-3"
        color="primary"
        isLoading={loading}
        onClick={handleClick}
      >
        {loading ? "loading" : "生成"}
      </Button>

      <Card className="max-w-[1200px] mt-3">
        <CardHeader className="flex gap-3 mt-2 mx-2">
          <i className="w-4 h-4 bg-[#ff5f59] rounded-full" />
          <i className="w-4 h-4 bg-[#ffbe2c] rounded-full" />
          <i className="w-4 h-4 bg-[#2aca44] rounded-full" />
        </CardHeader>
        <CardBody className="p-0">
          <SyntaxHighlighter
            showLineNumbers
            showInlineLineNumbers
            language="javascript"
            style={vscDarkPlus}
          >
            {text}
          </SyntaxHighlighter>
        </CardBody>
        <Divider />
        <CardFooter>
          <ButtonGroup variant="flat">
            <Button>{labelsMap[selectedOptionValue]}</Button>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button isIconOnly>
                  <ChevronDownIcon />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Merge options"
                selectedKeys={selectedOption}
                selectionMode="single"
                onSelectionChange={setSelectedOption}
                className="max-w-[300px]"
              >
                <DropdownItem
                  key="merge"
                  description={descriptionsMap["merge"]}
                >
                  {labelsMap["merge"]}
                </DropdownItem>
                <DropdownItem
                  key="squash"
                  description={descriptionsMap["squash"]}
                >
                  {labelsMap["squash"]}
                </DropdownItem>
                <DropdownItem
                  key="rebase"
                  description={descriptionsMap["rebase"]}
                >
                  {labelsMap["rebase"]}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </ButtonGroup>
        </CardFooter>
      </Card>
    </>
  );
};
