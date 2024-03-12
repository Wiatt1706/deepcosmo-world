"use client";
import { Chip } from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import { BiCaretDown, BiCaretRight, BiCurrentLocation } from "react-icons/bi";
import { PiEyeBold } from "react-icons/pi";

const TreeNode = ({ node }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className="group flex items-center w-full justify-between hover:bg-gray-200">
        <div className="flex items-center">
          {node.children && (
            <button className="pr-2 focus:outline-none" onClick={handleToggle}>
              {isOpen ? <BiCaretDown /> : <BiCaretRight />}
            </button>
          )}
          <span className="text-sm">
            <Chip startContent={node.startContent} variant="light">
              {node.label}
            </Chip>
          </span>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity pl-2 flex items-center">
          <div className="pr-2 hover:text-primary">
            <PiEyeBold />
          </div>
          <div className="pr-2 hover:text-primary">
            <BiCurrentLocation />
          </div>
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
