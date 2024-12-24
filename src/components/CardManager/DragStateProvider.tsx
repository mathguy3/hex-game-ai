import { createContext, useContext, useState } from 'react';
import { CardState } from '../../types/game';

const DragStateContext = createContext<{
  isDragging: boolean;
  setIsDragging: (value: boolean) => void;
  activeCard: CardState | null;
  setActiveCard: (value: CardState | null) => void;
}>(null);

export const DragStateProvider = ({ children }: React.PropsWithChildren) => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeCard, setActiveCard] = useState<CardState | null>(null);
  return (
    <DragStateContext.Provider value={{ isDragging, setIsDragging, activeCard, setActiveCard }}>
      {children}
    </DragStateContext.Provider>
  );
};
export const useDragState = () => {
  const context = useContext(DragStateContext);
  if (!context) {
    throw new Error('useDragState must be used within a DragStateProvider');
  }
  return context;
};
