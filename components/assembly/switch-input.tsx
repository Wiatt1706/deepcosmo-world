"use client";

import React from "react";
import {
  Switch,
  useSwitch,
  VisuallyHidden,
  SwitchProps,
} from "@nextui-org/react";
import { SecuritySvg } from "../utils/icons";

const SwitchInput = (props: SwitchProps) => {
  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps,
  } = useSwitch(props);

  return (
    <Component {...getBaseProps()}>
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div
        {...getWrapperProps()}
        className={slots.wrapper({
          class: [
            "w-24 h-8 text-default-500 text-sm",
            "flex items-center justify-center",
            "rounded-lg bg-default-100 hover:bg-default-200",
          ],
        })}
      >
        {isSelected ? <SecuritySvg fill="#fff" /> : <SecuritySvg />}{" "}
        <span className="ml-2">Verified</span>
      </div>
    </Component>
  );
};

export default SwitchInput;
