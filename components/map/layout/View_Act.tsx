"use client";

// components/RightActView/InfoSection.tsx
import { Input, Select } from "@/components/utils/DLCModule";
import {
  OPTION_TEST_LIST,
  OPTION_TEST_LIST4,
  OPTION_TEST_LIST5,
  Photo,
  PixelBlock,
} from "@/types/MapTypes";
import styles from "@/styles/canvas/ViewAct.module.css";
import { TbTrash, TbPlus, TbMapPin, TbLink } from "react-icons/tb";
import {
  Button,
  ButtonGroup,
  Select as NextSelect,
  SelectItem,
} from "@nextui-org/react";
import { useState, useEffect, useCallback } from "react";
import { clsx } from "clsx";
import { TbX } from "react-icons/tb";
import { useBaseStore, useEditMapStore } from "../SocketManager";
import { useNotification } from "@/components/utils/NotificationBar";
import PhotosModel from "./model/Model_Photos";
import { ColorPicker } from "@/components/utils/ColorPicker";
import { NumInput } from "@/components/utils/NumInput";

export default function RightActView({ setIsAct }: { setIsAct: any }) {
  const addNotification = useNotification((state) => state.addNotification);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPixelBlock, setSelectedPixelBlock, model] = useBaseStore(
    (state: any) => [
      state.selectedPixelBlock,
      state.setSelectedPixelBlock,
      state.model,
    ]
  );
  const [pixelBlocks, setPixelBlocks] = useEditMapStore((state: any) => [
    state.pixelBlocks,
    state.setPixelBlocks,
  ]);

  useEffect(() => {
    if (model === "EDIT") {
      setSelectedPixelBlock(null);
    }
  }, [model, setSelectedPixelBlock]);

  const updateData = useCallback(() => {
    setIsLoading(true);
    const updatedPixelBlocks = pixelBlocks.map((block: PixelBlock) =>
      block.id === selectedPixelBlock.id ? selectedPixelBlock : block
    );
    setPixelBlocks(updatedPixelBlocks);
    setTimeout(() => {
      setIsLoading(false);
      addNotification("Updated successfully", "success", "Update Success");
    }, 1000);
  }, [pixelBlocks, selectedPixelBlock, setPixelBlocks, addNotification]);

  const deletePixelBlock = useCallback(() => {
    const updatedPixelBlocks = pixelBlocks.filter(
      (block: any) => block.id !== selectedPixelBlock.id
    );
    setPixelBlocks(updatedPixelBlocks);
    setSelectedPixelBlock(null);
    setIsAct(false);
  }, [
    pixelBlocks,
    selectedPixelBlock,
    setPixelBlocks,
    setSelectedPixelBlock,
    setIsAct,
  ]);

  return (
    selectedPixelBlock && (
      <div className={styles["act-view"] + " m-4 rounded shadow border"}>
        <div className={styles["columnGgroup"] + " border-b"}>
          <div className={styles["col-title"]}>
            <h2 className={clsx([styles["col"], styles["title"]])}>
              #{selectedPixelBlock?.id}
            </h2>
            <button
              onClick={() => setIsAct(false)}
              className={clsx([styles["col"], styles["btn"]])}
            >
              <TbX />
            </button>
          </div>
        </div>
        <div className={clsx([styles["col-group"]])}>
          <PhotosModel
            landCoverImg={selectedPixelBlock.landCoverImg}
            showCoverImgs={selectedPixelBlock.showCoverImgList}
          />
          <div className={styles["columnGgroup"]}>
            <InfoSection
              selectedPixelBlock={selectedPixelBlock}
              setSelectedPixelBlock={setSelectedPixelBlock}
            />
            {/* Add other sections similarly */}
          </div>
        </div>
        <ActionButtons
          isLoading={isLoading}
          deletePixelBlock={deletePixelBlock}
          updateData={updateData}
        />
      </div>
    )
  );
}

export function InfoSection({
  selectedPixelBlock,
  setSelectedPixelBlock,
}: any) {
  return (
    <>
      <div className={styles["colRow"]}>
        <label className={clsx([styles["col"], styles["col-text"]])}>
          Size
        </label>
        <Input readOnly postfix="W" value={String(selectedPixelBlock.width)} />
        <Input readOnly postfix="H" value={String(selectedPixelBlock.height)} />
      </div>
      <div className={styles["colRow"]}>
        <label className={clsx([styles["col"], styles["col-text"]])}>
          <TbMapPin />
        </label>
        <Input readOnly postfix="X" value={String(selectedPixelBlock.x)} />
        <label className={clsx([styles["col"], styles["col-label"]])}>
          <TbLink />
        </label>
        <Input readOnly postfix="Y" value={String(selectedPixelBlock.y)} />
      </div>
      <div className={styles["colRow"]}>
        <label className={clsx([styles["col"], styles["col-text"]])}>
          <span>name</span>
        </label>
        <Input
          className={styles["actInput"]}
          value={selectedPixelBlock.name}
          onChange={(v) =>
            setSelectedPixelBlock({ ...selectedPixelBlock, name: v })
          }
        />
      </div>
      <div className={styles["colRow"]}>
        <label className={clsx([styles["col"], styles["col-text"]])}>
          <span>Type</span>
        </label>
        <Select
          options={OPTION_TEST_LIST}
          value={selectedPixelBlock.type || "1"}
          onChange={(v) =>
            setSelectedPixelBlock({ ...selectedPixelBlock, type: v })
          }
        />
      </div>

      <div className={styles["colRow"]}>
        <label className={clsx([styles["col"], styles["col-text"]])}>
          <span>Status</span>
        </label>

        <NextSelect
          items={OPTION_TEST_LIST4}
          key={selectedPixelBlock.status}
          classNames={{
            base: "shadow-none p-1",
            trigger: "shadow-none bg-[#f3f6f8]",
          }}
          onChange={(v) =>
            setSelectedPixelBlock({
              ...selectedPixelBlock,
              status: v.target.value,
            })
          }
          value={selectedPixelBlock.status || "1"}
          defaultSelectedKeys={[selectedPixelBlock.status || "1"]}
          placeholder="请选择"
          labelPlacement="outside"
          size="sm"
          listboxProps={{
            itemClasses: {
              base: [
                "rounded-md",
                "text-default-500",
                "transition-opacity",
                "data-[hover=true]:text-foreground",
                "data-[hover=true]:bg-default-100",
                "dark:data-[hover=true]:bg-default-50",
                "data-[selectable=true]:focus:bg-default-50",
                "data-[pressed=true]:opacity-70",
                "data-[focus-visible=true]:ring-default-500",
              ],
            },
          }}
          popoverProps={{
            classNames: {
              base: "before:bg-default-200",
              content: "p-0 border-small border-divider bg-background",
            },
          }}
          renderValue={(items) => {
            return items.map((item) => (
              <div key={item.key} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    backgroundColor: item.data?.color || "#272727",
                  }}
                />
                <div className="flex flex-col">
                  <span>{item.data?.name}</span>
                </div>
              </div>
            ));
          }}
        >
          {(item) => (
            <SelectItem
              key={item.value}
              textValue={item.name}
              value={item.value}
            >
              <div className="flex gap-2 items-center">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item?.color || "#272727" }}
                />
                <div className="flex flex-col">
                  <span className="text-small">{item.name}</span>
                </div>
              </div>
            </SelectItem>
          )}
        </NextSelect>
      </div>
      <div className={styles["colRow"]}>
        <label className={clsx([styles["col"], styles["col-text"]])}>
          <span>Group</span>
        </label>

        <NextSelect
          items={OPTION_TEST_LIST5}
          key={selectedPixelBlock.groupId}
          classNames={{
            base: "shadow-none p-1",
            trigger: "shadow-none bg-[#f3f6f8]",
          }}
          onChange={(v) =>
            setSelectedPixelBlock({
              ...selectedPixelBlock,
              groupId: v.target.value,
            })
          }
          value={selectedPixelBlock.groupId}
          defaultSelectedKeys={[selectedPixelBlock.groupId]}
          placeholder="无分组"
          labelPlacement="outside"
          size="sm"
          listboxProps={{
            itemClasses: {
              base: [
                "rounded-md",
                "text-default-500",
                "transition-opacity",
                "data-[hover=true]:text-foreground",
                "data-[hover=true]:bg-default-100",
                "dark:data-[hover=true]:bg-default-50",
                "data-[selectable=true]:focus:bg-default-50",
                "data-[pressed=true]:opacity-70",
                "data-[focus-visible=true]:ring-default-500",
              ],
            },
          }}
          popoverProps={{
            classNames: {
              base: "before:bg-default-200",
              content: "p-0 border-small border-divider bg-background",
            },
          }}
          renderValue={(items) => {
            return items.map((item) => (
              <div key={item.key} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    backgroundColor: item.data?.color || "#272727",
                  }}
                />
                <div className="flex flex-col">
                  <span>{item.data?.name}</span>
                </div>
              </div>
            ));
          }}
        >
          {(item) => (
            <SelectItem
              key={item.value}
              textValue={item.name}
              value={item.value}
            >
              <div className="flex gap-2 items-center">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item?.color || "#272727" }}
                />
                <div className="flex flex-col">
                  <span className="text-small">{item.name}</span>
                </div>
              </div>
            </SelectItem>
          )}
        </NextSelect>

        <Button
          isIconOnly
          size="sm"
          aria-label="plus"
          className="bg-[#f3f6f8] hover:bg-[#e4e4e7] mr-1"
        >
          <TbPlus />
        </Button>
      </div>
      <div className={styles["colRow"]}>
        <label className={clsx([styles["col"], styles["col-text"]])}>
          <span>borderSize</span>
        </label>

        <div className="w-[140px] bg-[#f3f6f8] p-1 rounded-[8px] m-1">
          <NumInput
            value={selectedPixelBlock.borderSize}
            onUpdate={(value) => {
              setSelectedPixelBlock({
                ...selectedPixelBlock,
                borderSize: value,
              });
            }}
            suffix="px"
            maxValue={10}
            minValue={1}
          />
        </div>
      </div>
      <div className={styles["colRow"]}>
        <ColorPicker
          className="bg-[#fff] p-1 text-[#242424] text-sm font-[600] "
          label="BgColor"
          value={selectedPixelBlock.color}
          onChange={(e) =>
            setSelectedPixelBlock({
              ...selectedPixelBlock,
              color: e.target.value,
            })
          }
        />
      </div>
    </>
  );
}

export function ActionButtons({
  isLoading,
  deletePixelBlock,
  updateData,
}: any) {
  return (
    <div className={styles["fixed-bottom"]}>
      <div className={styles["columnGgroup"]}>
        <div className={styles["colRow"]}>
          <ButtonGroup className="w-full">
            <Button
              isIconOnly
              size="lg"
              aria-label="TbTrashFilled"
              onClick={deletePixelBlock}
            >
              <TbTrash />
            </Button>
            <Button
              isLoading={isLoading}
              spinner={
                <svg
                  className="animate-spin h-5 w-5 text-current"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    fill="currentColor"
                  />
                </svg>
              }
              className="w-full"
              onClick={updateData}
              size="lg"
              color="primary"
              aria-label="update"
            >
              Update
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
}
