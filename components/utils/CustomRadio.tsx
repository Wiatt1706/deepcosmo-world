import { RadioProps, VisuallyHidden, cn, useRadio } from "@nextui-org/react";

export const CustomRadio = (props: RadioProps) => {
  const {
    Component,
    children,
    getBaseProps,
    getInputProps,
    getLabelWrapperProps,
  } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className={cn(
        " text-[#707987] text-[14px] font-[500] leading-[1.5] tracking-[0.5px] inline-flex bg-[#f3f6f8] hover:bg-[#d9e0e6] hover:text-[#242424] ",
        "min-w-[40px] w-full min-h-[40px] flex items-center justify-center cursor-pointer m-1  rounded",
        "data-[selected=true]:bg-[#d9e0e6] data-[selected=true]:text-[#242424]",
        "transition duration-300" // 添加动画和持续时间类
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>

      <div>
        {children && (
          <div className="flex items-center justify-center ">{children}</div>
        )}
      </div>
    </Component>
  );
};
