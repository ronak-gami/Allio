import React, {
  createContext,
  useContext,
  useRef,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { GlobalBottomSheet } from '@components/atoms/GlobalBottomSheet';

export interface BottomSheetConfig {
  title?: string;
  content: ReactNode;
  snapPoints?: string[];
  enableBackdrop?: boolean;
  enableHandle?: boolean;
  backdropOpacity?: number;
  onStateChange?: (state: 'opened' | 'closed') => void;
  showCloseButton?: boolean;
  buttons?: Array<{
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
  initialIndex?: number;
}

interface BottomSheetContextType {
  showBottomSheet: (config: BottomSheetConfig) => void;
  hideBottomSheet: () => void;
  updateBottomSheet: (config: Partial<BottomSheetConfig>) => void;
  expandBottomSheet: () => void;
  collapseBottomSheet: () => void;
  snapToIndex: (index: number) => void;
  isVisible: boolean;
  currentIndex: number;
}

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(
  undefined,
);

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error('useBottomSheet must be used within a BottomSheetProvider');
  }
  return context;
};

interface BottomSheetProviderProps {
  children: ReactNode;
}

export const BottomSheetProvider: React.FC<BottomSheetProviderProps> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [config, setConfig] = useState<BottomSheetConfig | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const showBottomSheet = useCallback((newConfig: BottomSheetConfig) => {
    setConfig(newConfig);
    const targetIndex = newConfig.initialIndex ?? 0;
    bottomSheetRef.current?.snapToIndex(targetIndex);
    setCurrentIndex(targetIndex);
    setIsVisible(true);
  }, []);

  const hideBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
    setCurrentIndex(-1);
    setIsVisible(false);
  }, []);

  const expandBottomSheet = useCallback(() => {
    const snapPoints = config?.snapPoints || ['25%', '50%', '75%'];
    const lastIndex = snapPoints.length - 1;
    bottomSheetRef.current?.snapToIndex(lastIndex);
    setCurrentIndex(lastIndex);
  }, [config]);

  const collapseBottomSheet = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(0);
    setCurrentIndex(0);
  }, []);

  const snapToIndex = useCallback((index: number) => {
    bottomSheetRef.current?.snapToIndex(index);
    setCurrentIndex(index);
  }, []);

  const updateBottomSheet = useCallback(
    (newConfig: Partial<BottomSheetConfig>) => {
      if (config) {
        setConfig({ ...config, ...newConfig });
      }
    },
    [config],
  );

  const handleSheetChanges = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      setIsVisible(index !== -1);

      if (index === -1) {
        config?.onStateChange?.('closed');
        setConfig(null);
      } else {
        config?.onStateChange?.('opened');
      }
    },
    [config],
  );

  return (
    <BottomSheetContext.Provider
      value={{
        showBottomSheet,
        hideBottomSheet,
        updateBottomSheet,
        expandBottomSheet,
        collapseBottomSheet,
        snapToIndex,
        isVisible,
        currentIndex,
      }}>
      {children}
      {/* Global Bottom Sheet Component how can we use backdrophandler*/}
      <GlobalBottomSheet
        ref={bottomSheetRef}
        config={config}
        onSheetChange={handleSheetChanges}
      />
    </BottomSheetContext.Provider>
  );
};

// Import will be resolved when we create the component
