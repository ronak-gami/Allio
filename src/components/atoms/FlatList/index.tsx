import React, { forwardRef, memo } from 'react';
import { FlatList } from 'react-native';
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
        numColumns={numColumns}
        keyExtractor={(_, i) => i?.toString()}
        columnWrapperStyle={numColumns > 1 ? columnWrapperStyle : undefined}
        contentContainerStyle={[
          contentContainerStyle,
          data.length === 0 && styles.center,
        ]}
        ListEmptyComponent={
          ListEmptyComponent || (
            <Text style={styles.emptyText}>No items found.</Text>
          )
        }
        removeClippedSubviews={false}
        {...props}
      />
    );
  },
);

export default memo(CustomFlatList);
