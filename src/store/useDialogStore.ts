import { create } from "zustand";

// Define the type for our dialog components
type DialogComponent = React.ComponentType<any>;

// Define the store state
interface DialogState {
  isOpen: boolean;
  component: DialogComponent | null;
  props: Record<string, any>;
  openDialog: (component: DialogComponent, props?: Record<string, any>) => void;
  closeDialog: () => void;
}

// Create the store
const useDialogStore = create<DialogState>((set) => ({
  isOpen: false,
  component: null,
  props: {},
  openDialog: (component, props = {}) =>
    set({ isOpen: true, component, props }),
  closeDialog: () => set({ isOpen: false, component: null, props: {} }),
}));

export default useDialogStore;
