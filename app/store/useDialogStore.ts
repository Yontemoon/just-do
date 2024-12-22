/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { ComponentType } from "react";

type DialogState = {
  DialogComponent: ComponentType<any> | null;
  dialogProps?: { [key: string]: unknown };
  openDialog: (
    Component: ComponentType<any>,
    props?: { [key: string]: unknown }
  ) => void;
  closeDialog: () => void;
  isDialogOpen: () => boolean;
};

export const useDialogStore = create<DialogState>((set, get) => ({
  DialogComponent: null,
  dialogProps: {},
  openDialog: (Component, props) =>
    set({ DialogComponent: Component, dialogProps: props }),
  closeDialog: () => set({ DialogComponent: null, dialogProps: {} }),
  isDialogOpen: () => get().DialogComponent !== null,
}));
