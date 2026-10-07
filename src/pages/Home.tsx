import React, {useCallback} from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {
  ActivityIndicator,
  Avatar,
  IconButton,
  Searchbar,
  Surface,
  Text,
} from 'react-native-paper';
import {IExchangeRate} from '../types/crypto';
import {useCrypto} from '../hooks/useCrypto';
import CryptoListItem from '../components/CryptoListItem/CryptoListItem';

function HomeScreen() {
  const {
    rates,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    refreshing,
    hasMore,
    refresh,
    loadMore,
  } = useCrypto();

  const renderItem = useCallback(
    ({item}: {item: IExchangeRate}) => <CryptoListItem item={item} />,
    [],
  );

  const renderFooter = () => {
    if (!loading || refreshing) {
      return null;
    }

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading && !refreshing) {
      return null;
    }

    return (
      <View style={styles.emptyContainer}>
        <Text>No cryptocurrencies found</Text>
      </View>
    );
  };

  const renderHeader = () => (
    <>
      <Surface style={styles.header} elevation={0}>
        <View style={styles.userInfo}>
          <Avatar.Image size={36} source={{uri: 'https://picsum.photos/200'}} />
          <View style={styles.welcomeText}>
            <Text variant="titleMedium" style={styles.userName}>
              Jhon Doe
            </Text>
            <Text variant="bodyMedium" style={styles.welcomeBack}>
              Welcome Back
            </Text>
          </View>
          <IconButton
            icon="bell-outline"
            size={24}
            style={styles.notificationIcon}
          />
        </View>
      </Surface>
      <Searchbar
        placeholder="Search cryptocurrencies..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
        elevation={1}
      />
    </>
  );

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar
        animated
        backgroundColor={'#003554'}
        barStyle={'light-content'}
      />

      <SafeAreaView style={{flex: 0, backgroundColor: '#003554'}} />

      <FlatList
        data={rates}
        renderItem={renderItem}
        keyExtractor={item => item.symbol}
        onRefresh={refresh}
        refreshing={refreshing}
        onEndReached={hasMore ? loadMore : undefined}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        ListHeaderComponent={renderHeader}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        ItemSeparatorComponent={() => <View style={{height: 8}} />}
      />
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#003554',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontWeight: '600',
    color: 'white',
  },
  welcomeBack: {
    opacity: 0.7,
    color: 'white',
  },
  notificationIcon: {
    marginLeft: 'auto',
    color: 'white',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  assetName: {
    fontWeight: '500',
  },
  zeroAssets: {
    opacity: 0.7,
  },

  ethereumIcon: {
    backgroundColor: '#627EEA',
    marginBottom: 12,
  },

  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchbar: {
    margin: 16,
    elevation: 2,
    backgroundColor: 'white',
  },
  listContent: {
    paddingBottom: 16,
    flexGrow: 1,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
});

export default HomeScreen;
