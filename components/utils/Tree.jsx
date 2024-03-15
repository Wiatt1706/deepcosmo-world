"use client";
import { Chip } from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import { BiCaretDown, BiCaretRight } from "react-icons/bi";

const TreeNode = ({ node }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div
        className={`group flex items-center w-full justify-between hover:bg-gray-200  px-4 ${
          node.isSelect && "bg-gray-100"
        }`}
      >
        <div className="flex items-center">
          {node.children && node.children.length > 0 && (
            <button className=" focus:outline-none" onClick={handleToggle}>
              {isOpen ? <BiCaretDown /> : <BiCaretRight />}
            </button>
          )}
          <span className="flex items-center p-1">
            <Chip
              className="text-default-600"
              startContent={node.startContent}
              variant="light"
            >
              {node.label}
            </Chip>
          </span>
        </div>
        <div
          className={`opacity-0 group-hover:opacity-100 transition-opacity pl-2 flex items-center ${
            node.isSelect && "opacity-100"
          }`}
        >
          {node.toolList?.map((tool, index) => (
            <div key={index} className="pr-2 hover:text-primary">
              {tool}
            </div>
          ))}
        </div>
      </div>
      {isOpen && node.children && (
        <div className="pl-4">
          {node.children.map((childNode, index) => (
            <TreeNode key={index} node={childNode} />
          ))}
        </div>
      )}
    </div>
  );
};

const Tree = ({ data }) => {
  return (
    <div className="w-full">
      {data.map((node, index) => (
        <TreeNode key={index} node={node} />
      ))}
    </div>
  );
};

export default Tree;
