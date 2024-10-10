import { DialogHTMLAttributes, useEffect, useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { useDialogStore } from "@/store/useDialogStore";

type PropTypes = DialogHTMLAttributes<HTMLDialogElement> & {
  openModal: boolean;
  closeModal: () => void;
  children: React.ReactNode;
};
const Dialog = ({ openModal, children }: PropTypes) => {
  const ref = useRef<HTMLDialogElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const { closeDialog } = useDialogStore();
  useEffect(() => {
    if (openModal) {
      ref?.current?.showModal();
    } else {
      ref?.current?.close();
    }
  }, [openModal]);

  useOnClickOutside(wrapperRef, closeDialog);

  return (
    <dialog ref={ref} className="p-6 rounded-sm z-50 min-w-[500px]">
      <div ref={wrapperRef}>{children}</div>
    </dialog>
  );
};

export default Dialog;
