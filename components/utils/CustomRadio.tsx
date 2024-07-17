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
        " text-[#707987] text-[14px] font-[500] leading-[1.5] tracking-[0.5px] inline-flex hover:bg-[#f8fafc] hover:text-[#242424] ",
        "w-full flex items-center justify-center cursor-pointer  rounded-[50px] px-4 py-1",
        "data-[selected=true]:bg-[#f3f6f8] data-[selected=true]:text-[#242424]"
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>

      <div {...getLabelWrapperProps()}>
        {children && <span>{children}</span>}
      </div>
    </Component>
  );
};
