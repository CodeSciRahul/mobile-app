import { cn } from '@/lib/utils';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface BottomSheetProps {
  /**
   * The content to render inside the bottom sheet
   */
  children: React.ReactNode;
  /**
   * Whether the bottom sheet is open
   */
  open: boolean;
  /**
   * Callback when the bottom sheet should close
   */
  onClose: () => void;
  /**
   * Custom snap points for the bottom sheet (defaults to ['25%', '50%', '90%'])
   */
  snapPoints?: (string | number)[];
  /**
   * Initial snap point index (defaults to 1, which is typically '50%')
   */
  initialSnapIndex?: number;
  /**
   * Whether to show the handle/indicator bar at the top (defaults to true)
   */
  showHandle?: boolean;
  /**
   * Enable pan down to close gesture (defaults to true)
   */
  enablePanDownToClose?: boolean;
  /**
   * Custom className for the bottom sheet content container
   */
  className?: string;
  /**
   * Custom className for the handle indicator
   */
  handleClassName?: string;
  /**
   * Background color for the backdrop overlay (defaults to 'rgba(0, 0, 0, 0.5)')
   */
  backdropColor?: string;
  /**
   * Whether to show backdrop (defaults to true)
   */
  showBackdrop?: boolean;
  /**
   * Whether the bottom sheet can be dismissed by tapping the backdrop (defaults to true)
   */
  backdropDismissible?: boolean;
}

/**
 * A beautiful, reusable bottom sheet component
 * 
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 * 
 * <BottomSheetComponent open={open} onClose={() => setOpen(false)}>
 *   <View className="p-4">
 *     <Text>Your content here</Text>
 *   </View>
 * </BottomSheetComponent>
 * ```
 */
export function BottomSheetComponent({
  children,
  open,
  onClose,
  snapPoints = ['25%', '50%', '90%'],
  initialSnapIndex = 1,
  showHandle = true,
  enablePanDownToClose = true,
  className,
  handleClassName,
  backdropColor = 'rgba(0, 0, 0, 0.5)',
  showBackdrop = true,
  backdropDismissible = true,
}: BottomSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();

  // Convert snap points to array if needed and memoize
  const memoizedSnapPoints = useMemo(() => snapPoints, [snapPoints]);

  // Handle sheet changes
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

  // Control the bottom sheet based on open prop
  useEffect(() => {
    if (!bottomSheetRef.current) return;
    
    if (open) {
      // Ensure the component is mounted and ready before opening
      const timer = setTimeout(() => {
        if (bottomSheetRef.current) {
          bottomSheetRef.current.snapToIndex(initialSnapIndex);
        }
      }, 50);
      
      return () => clearTimeout(timer);
    } else {
      bottomSheetRef.current.close();
    }
  }, [open, initialSnapIndex]);

  // Custom backdrop component
  const renderBackdrop = useCallback(
    (props: any) => {
      if (!showBackdrop) return null;

      return (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
          pressBehavior={backdropDismissible ? 'close' : 'none'}
          style={[
            props.style,
            {
              backgroundColor: backdropColor,
            },
          ]}
        />
      );
    },
    [backdropColor, showBackdrop, backdropDismissible]
  );

  // Handle indicator component
  const HandleIndicator = useCallback(() => {
    if (!showHandle) return null;

    return (
      <View className={cn('items-center py-3', handleClassName)}>
        <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
      </View>
    );
  }, [showHandle, handleClassName]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={memoizedSnapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={enablePanDownToClose}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{
        display: 'none', // Hide default indicator, we'll use custom one
      }}
      backgroundStyle={{
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
      style={{
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 20,
      }}
      android_keyboardInputMode="adjustResize"
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
    >
      <BottomSheetView
        style={[
          {
            flex: 1,
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}
      >
        <HandleIndicator />
        <View className={cn('flex-1', className)}>
          {children}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}

/**
 * Hook to easily manage bottom sheet state
 * 
 * @example
 * ```tsx
 * const { open, onOpen, onClose } = useBottomSheet();
 * 
 * <Button onPress={onOpen}>Open Bottom Sheet</Button>
 * <BottomSheetComponent open={open} onClose={onClose}>
 *   <Text>Your content here</Text>
 * </BottomSheetComponent>
 * ```
 */
export function useBottomSheet() {
  const [open, setOpen] = useState(false);

  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);

  return {
    open,
    onOpen,
    onClose,
  };
}

