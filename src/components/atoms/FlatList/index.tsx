import React, { forwardRef, memo } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import useStyle from './style';
import Text from '../Text';

interface CustomFlatListProps {
  data: any[];
  renderItem: ({ item, index }: { item: any; index: number }) => JSX.Element;
  numColumns?: number;
  columnWrapperStyle?: object;
  contentContainerStyle?: object;
  ListEmptyComponent?: JSX.Element;
  [key: string]: any;
  refreshing?: boolean;
  onRefresh?: () => void;
}

const CustomFlatList = forwardRef<FlatList<any>, CustomFlatListProps>(
  (
    {
      numColumns = 1,
      columnWrapperStyle,
      contentContainerStyle,
      ListEmptyComponent,
      renderItem,
      data,
      refreshing = false,
      onRefresh,
      ...props
    },
    ref,
  ) => {
    const styles = useStyle();

    return (
      <FlatList
        ref={ref}
        data={data}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, i) => i?.toString()}
        columnWrapperStyle={numColumns > 1 ? columnWrapperStyle : undefined}
        contentContainerStyle={[
          contentContainerStyle,
          data.length === 0 && styles.center,
        ]}
        ListEmptyComponent={
          ListEmptyComponent || (
            <Text type="BOLD" style={styles.emptyText}>
              No items found.
            </Text>
          )
        }
        removeClippedSubviews={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
        {...props}
      />
    );
  },
);

export default memo(CustomFlatList);
