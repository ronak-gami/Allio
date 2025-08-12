import { ReactElement } from 'react';
import { BottomSheetModalProps } from '@gorhom/bottom-sheet';

interface AppBottomSheetProps extends BottomSheetModalProps {
  height?: string[] | number[];
  children: ReactElement | ReactElement[];
  onDismiss?(): void;
}

export type { AppBottomSheetProps };
