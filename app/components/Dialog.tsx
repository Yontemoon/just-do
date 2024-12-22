import { useEffect, useRef, useState } from "react";
import type { ComponentProps } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { useDialogStore } from "@/store/useDialogStore";

type PropTypes = ComponentProps<"dialog"> & {
  children: React.ReactNode;
};
const Dialog = ({ children }: PropTypes) => {
  const ref = useRef<HTMLDialogElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const { closeDialog, isDialogOpen } = useDialogStore();
  const isOpen = isDialogOpen();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      ref?.current?.showModal();
    } else {
      ref?.current?.setAttribute("closing", "");
      setTimeout(() => {
        ref?.current?.close();
        setIsVisible(false);
        ref?.current?.removeAttribute("closing");
      }, 200);
    }
  }, [isOpen]);

  useOnClickOutside(wrapperRef, closeDialog);

  return (
    <dialog
      ref={ref}
      className={`p-6 rounded-sm z-50 min-w-[500px] shadow-md transition-opacity duration-150
        ${isVisible ? "opacity-100" : "opacity-0"}
        ${ref.current?.hasAttribute("closing") ? "opacity-0" : ""}`}
    >
      <div ref={wrapperRef}>{children}</div>
    </dialog>
  );
};

export default Dialog;
