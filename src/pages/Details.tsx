import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Pressable,
} from 'react-native';
import {Text, ActivityIndicator, Surface} from 'react-native-paper';
import {useCryptoDetails} from '../hooks/useCryptoDetails';
import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';

type DetailScreenProps = NativeStackScreenProps<RootStackParamList, 'Details'>;

const DetailScreen = ({route}: DetailScreenProps) => {
  const {cryptoId} = route.params;

  const navigation = useNavigation();

  const {details, loading, error, refresh} = useCryptoDetails(cryptoId);

  if (loading && !details) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!details) {
    return (
      <View style={styles.errorContainer}>
        <Text>No data available</Text>
      </View>
    );
  }

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <>
      <StatusBar
        animated
        backgroundColor={'#003554'}
        barStyle={'light-content'}
      />
      <SafeAreaView style={{flex: 0, backgroundColor: '#003554'}} />

      <View style={styles.backgroundHeader}>
        <Surface style={styles.header} elevation={0}>
          <View style={styles.headerContent}>
            <Pressable onPress={handleGoBack} style={styles.backButton}>
              <Text style={{color: 'white'}}> {'<-'} Back</Text>
            </Pressable>

            <Text
              variant="titleMedium"
              style={{color: 'white', textAlign: 'center'}}>
              {details.symbol} / USDT
            </Text>
            <View style={styles.headerRight} />
          </View>
        </Surface>

        <Text variant="titleLarge" style={styles.price}>
          {details.formatUSDValue()}
        </Text>

        <Text
          style={[
            styles.priceChange,
            details.is24hChangePositive()
              ? styles.positiveChange
              : styles.negativeChange,
          ]}>
          {details.get24hChange()}
        </Text>
      </View>

      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }>
        <Surface style={styles.infoCard} elevation={2}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Market Cap</Text>
            <Text style={styles.value}>{details.formatMarketCap()}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Volume 24h</Text>
            <Text style={styles.value}>{details.get24hVolume()}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Circulating Supply</Text>
            <Text style={styles.value}>{details.getCirculatingSupply()}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Max Supply</Text>
            <Text style={styles.value}>{details.getMaxSupply()}</Text>
          </View>
        </Surface>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#003554',
    paddingTop: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    height: 56,
  },
  backButton: {
    marginLeft: 10,
  },
  headerTitle: {
    color: 'white',
    flex: 1,
    textAlign: 'center',
    marginLeft: -48, // Compensate for the back button width to center the title
  },
  headerRight: {
    width: 48, // Same width as back button for symmetry
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceCard: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    paddingTop: 5,
    paddingBottom: 5,
  },
  priceChange: {
    fontSize: 18,
    textAlign: 'center',
    paddingBottom: 10,
  },
  infoCard: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  label: {
    opacity: 0.7,
  },
  value: {
    fontWeight: '500',
  },
  positiveChange: {
    color: '#4CAF50',
  },
  negativeChange: {
    color: '#F44336',
  },
  backgroundHeader: {
    backgroundColor: '#003554',
    padding: 10,
    borderBottomEndRadius: 100,
    borderBottomStartRadius: 100,
  },
});

export default DetailScreen;
