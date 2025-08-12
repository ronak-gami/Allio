import React, {
  createContext,
  useContext,
  useRef,
  useState,
  ReactNode,
} from 'react';

interface BottomSheetButton {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

interface BottomSheetConfig {
  title?: string;
  content?: ReactNode | null;
  snapPoints?: string[];
  showCloseButton?: boolean;
  buttons?: BottomSheetButton[];
}

interface BottomSheetContextType {
  bottomSheetRef: React.MutableRefObject<any>;
  tabBarRef: React.MutableRefObject<any>;
  snapPoints: string[];
  content: ReactNode | null;
  title: string | null;
  showCloseButton: boolean;
  buttons: BottomSheetButton[];
  openBottomSheet: (config: BottomSheetConfig) => void;
  closeBottomSheet: () => void;
  updateSnapPoints: (newSnapPoints: string[]) => void;
  setContent: (content: ReactNode | null) => void;
}

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(
  undefined,
);

interface BottomSheetProviderProps {
  children: ReactNode;
}

export const BottomSheetProvider: React.FC<BottomSheetProviderProps> = ({
  children,
}) => {
  const bottomSheetRef = useRef<any>(null);
  const tabBarRef = useRef<any>(null);
  const [snapPoints, setSnapPoints] = useState<string[]>(['50%']);
  const [content, setContent] = useState<ReactNode | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [showCloseButton, setShowCloseButton] = useState<boolean>(true);
  const [buttons, setButtons] = useState<BottomSheetButton[]>([]);

  const openBottomSheet = (config: BottomSheetConfig) => {
    console.log('Opening bottom sheet with config:', config);

    if (bottomSheetRef.current) {
      // Set all configuration
      setSnapPoints(config.snapPoints || ['50%']);
      setContent(config.content || null);
      setTitle(config.title || null);
      setShowCloseButton(config.showCloseButton ?? true);
      setButtons(config.buttons || []);

      // Open the bottom sheet
      bottomSheetRef.current.snapToIndex(0);

      // Hide tab bar when bottom sheet opens
      if (tabBarRef.current && tabBarRef.current.setTabBarVisible) {
        tabBarRef.current.setTabBarVisible(false);
      }
    } else {
      console.warn('BottomSheet ref is not available');
    }
  };

  const closeBottomSheet = () => {
    console.log('Closing bottom sheet');

    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();

      // Show tab bar when bottom sheet closes
      if (tabBarRef.current && tabBarRef.current.setTabBarVisible) {
        tabBarRef.current.setTabBarVisible(true);
      }

      // Clear all state after closing
      setTimeout(() => {
        setContent(null);
        setTitle(null);
        setShowCloseButton(true);
        setButtons([]);
      }, 300);
    } else {
      console.warn('BottomSheet ref is not available for closing');
    }
  };

  const updateSnapPoints = (newSnapPoints: string[]) => {
    setSnapPoints(newSnapPoints);
  };

  return (
    <BottomSheetContext.Provider
      value={{
        bottomSheetRef,
        tabBarRef,
        snapPoints,
        content,
        title,
        showCloseButton,
        buttons,
        openBottomSheet,
        closeBottomSheet,
        updateSnapPoints,
        setContent,
      }}>
      {children}
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = (): BottomSheetContextType => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error('useBottomSheet must be used within a BottomSheetProvider');
  }
  return context;
};
