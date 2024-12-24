import { createContext, useContext, useState } from 'react';

const DragStateContext = createContext<{ isDragging: boolean; setIsDragging: (value: boolean) => void }>(null);

export const DragStateProvider = ({ children }: React.PropsWithChildren) => {
  const [isDragging, setIsDragging] = useState(false);
  return <DragStateContext.Provider value={{ isDragging, setIsDragging }}>{children}</DragStateContext.Provider>;
};
export const useDragState = () => {
  const context = useContext(DragStateContext);
  if (!context) {
    throw new Error('useDragState must be used within a DragStateProvider');
  }
  return context;
};
