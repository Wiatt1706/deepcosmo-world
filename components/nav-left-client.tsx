"use client";
import React, { useState } from "react";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";

import {
  ChevronDown,
  Lock,
  Activity,
  Flash,
  Server,
  TagUser,
  Scale,
  LogoSvg,
} from "@/components/utils/icons";
import NextLink from "next/link";
import clsx from "clsx";
export default function NavLeftClient() {
  const items = [
    {
      key: "new",
      label: "New file",
    },
    {
      key: "copy",
      label: "Copy link",
    },
    {
      key: "edit",
      label: "Edit file",
    },
    {
      key: "delete",
      label: "Delete file",
    },
  ];

  const icons = {
    chevron: <ChevronDown fill="currentColor" size={16} />,
    scale: <Scale className="text-warning" fill="currentColor" size={30} />,
    lock: <Lock className="text-success" fill="currentColor" size={30} />,
    activity: (
      <Activity className="text-secondary" fill="currentColor" size={30} />
    ),
    flash: <Flash className="text-primary" fill="currentColor" size={30} />,
    server: <Server className="text-success" fill="currentColor" size={30} />,
    user: <TagUser className="text-danger" fill="currentColor" size={30} />,
  };
  return (
    <>
      <div className="border-r border-conditionalborder-transparent  h-[48px] flex items-center px-3">
        <LogoSvg width={25} height={25} />
      </div>

      <div className="flex items-center hidden sm:flex">
        <div className="navbar_item">
          <Dropdown>
            <DropdownTrigger>
              <Button
                radius="none"
                className="bg-white text-black border border-conditionalborder-transparent "
                size="sm"
              >
                New file
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Dynamic Actions" items={items}>
              {(item) => (
                <DropdownItem
                  key={item.key}
                  color={item.key === "delete" ? "danger" : "default"}
                  className={item.key === "delete" ? "text-danger" : ""}
                >
                  {item.label}
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="navbar_item">
          <NextLink
            className={clsx(
              "data-[active=true]:text-primary data-[active=true]:font-medium"
            )}
            href="/"
          >
            活动
          </NextLink>
        </div>
        <div className="navbar_item">
          <NextLink
            className={clsx(
              "data-[active=true]:text-primary data-[active=true]:font-medium"
            )}
            href="/"
          >
            创作
          </NextLink>
        </div>
        <Dropdown>
          <DropdownTrigger>
            <Button
              disableRipple
              className="p-0 bg-transparent data-[hover=true]:bg-transparent text-[14px]"
              endContent={icons.chevron}
            >
              特性
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="ACME features"
            className="w-[340px]"
            itemClasses={{
              base: "gap-4",
            }}
          >
            <DropdownItem
              key="autoscaling"
              description="ACME scales apps to meet user demand, automagically, based on load."
              startContent={icons.scale}
            >
              Autoscaling
            </DropdownItem>
            <DropdownItem
              key="usage_metrics"
              description="Real-time metrics to debug issues. Slow query added? We’ll show you exactly where."
              startContent={icons.activity}
            >
              Usage Metrics
            </DropdownItem>
            <DropdownItem
              key="production_ready"
              description="ACME runs on ACME, join us and others serving requests at web scale."
              startContent={icons.flash}
            >
              Production Ready
            </DropdownItem>
            <DropdownItem
              key="99_uptime"
              description="Applications stay on the grid with high availability and high uptime guarantees."
              startContent={icons.server}
            >
              +99% Uptime
            </DropdownItem>
            <DropdownItem
              key="supreme_support"
              description="Overcome any challenge with a supporting team ready to respond."
              startContent={icons.user}
            >
              +Supreme Support
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </>
  );
}
