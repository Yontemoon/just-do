/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { ComponentType } from "react";

type DialogState = {
  dialogComponent: ComponentType<any> | null;
  dialogProps?: { [key: string]: unknown };
  openDialog: (
    Component: ComponentType<any>,
    props?: { [key: string]: unknown }
  ) => void;
  closeDialog: () => void;
  isDialogOpen: () => boolean;
};

export const useDialogStore = create<DialogState>((set, get) => ({
  dialogComponent: null,
  dialogProps: {},
  openDialog: (Component, props) =>
    set({ dialogComponent: Component, dialogProps: props }),
  closeDialog: () => set({ dialogComponent: null, dialogProps: {} }),
  isDialogOpen: () => get().dialogComponent !== null,
}));
