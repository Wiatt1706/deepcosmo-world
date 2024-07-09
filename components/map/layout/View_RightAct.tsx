// pages/NewMapPage.tsx
"use client";
import { Input, Select } from "@/components/utils/DLCModule";
import PhotoSlider from "@/components/utils/PhotoGallery";
import styles from "@/styles/canvas/ViewRightAct.module.css";
import { OPTION_TEST_LIST, PixelBlock } from "@/types/MapTypes";
import { clsx } from "clsx";
import { TbLink, TbMapPin, TbX } from "react-icons/tb";

export default function RightActView({
  actPixelBlock,
  isAct,
  setIsAct,
}: {
  actPixelBlock?: PixelBlock | null;
  isAct: boolean;
  setIsAct: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    actPixelBlock &&
    isAct && (
      <div className={styles["right-view"] + " m-4 rounded shadow"}>
        <div className={styles["columnGgroup"]}>
          <div className={styles["colRow"]}>
            <div className={styles["col-title"]}>
              <h2 className={clsx([styles["col"], styles["title"]])}>
                #{actPixelBlock?.x}
                {actPixelBlock?.y}
              </h2>
              <button
                onClick={() => setIsAct(false)}
                className={clsx([styles["col"], styles["btn"]])}
              >
                <TbX />
              </button>
            </div>
          </div>
        </div>

        {actPixelBlock.imgSrc && (
          <PhotoSlider
            photos={[{ id: actPixelBlock.imgSrc, url: actPixelBlock.imgSrc }]}
          />
        )}

        <div className={styles["columnGgroup"]}>
          <div className={styles["colRow"]}>
            <label className={clsx([styles["col"], styles["col-text"]])}>
              Size
            </label>
            <Input
              className={styles["actInput"]}
              readOnly
              postfix="W"
              value={actPixelBlock.width}
            />
            <Input
              className={styles["actInput"]}
              readOnly
              postfix="H"
              value={actPixelBlock.height}
            />
          </div>

          <div className={styles["colRow"]}>
            <label className={clsx([styles["col"], styles["col-text"]])}>
              <TbMapPin />
            </label>
            <Input
              className={styles["actInput"]}
              readOnly
              postfix="X"
              value={actPixelBlock.x}
            />
            <label className={clsx([styles["col"], styles["col-label"]])}>
              <TbLink />
            </label>
            <Input
              className={styles["actInput"]}
              readOnly
              postfix="Y"
              value={actPixelBlock.y}
            />
          </div>

          <div className={styles["colRow"]}>
            <label className={clsx([styles["col"], styles["col-text"]])}>
              <span>name</span>
            </label>
            <Input
              className={styles["actInput"]}
              readOnly
              value={actPixelBlock.name}
            />
          </div>

          <div className={styles["colRow"]}>
            <label className={clsx([styles["col"], styles["col-text"]])}>
              <span>Type</span>
            </label>
            <Select
              options={OPTION_TEST_LIST}
              readOnly
              value={actPixelBlock.type}
            />
          </div>
        </div>

        <div className={styles["fixed-bottom"]}>
          <div className={styles["columnGgroup"]}>
            <div className={styles["colRow"]}>
              <a
                className={styles["editBtn"]}
                href={`/pixel/edit/${actPixelBlock?.id}`}
              >
                Edit
              </a>
            </div>

            <div className={styles["colRow"]}>
              <a className={styles["skipBtn"]} href={actPixelBlock?.skipUrl}>
                Go
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
