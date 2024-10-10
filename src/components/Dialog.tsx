import { DialogHTMLAttributes, useEffect, useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { useDialogStore } from "@/store/useDialogStore";

type PropTypes = DialogHTMLAttributes<HTMLDialogElement> & {
  children: React.ReactNode;
};
const Dialog = ({ children }: PropTypes) => {
  const ref = useRef<HTMLDialogElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const { closeDialog, isDialogOpen } = useDialogStore();
  const isOpen = isDialogOpen();

  useEffect(() => {
    if (isOpen) {
      ref?.current?.showModal();
    } else {
      ref?.current?.close();
    }
  }, [isOpen]);

  useOnClickOutside(wrapperRef, closeDialog);

  return (
    <dialog ref={ref} className="p-6 rounded-sm z-50 min-w-[500px]">
      <div ref={wrapperRef}>{children}</div>
    </dialog>
  );
};

export default Dialog;
