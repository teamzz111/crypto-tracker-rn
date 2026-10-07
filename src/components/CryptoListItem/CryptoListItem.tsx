import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Card, Text} from 'react-native-paper';
import {IExchangeRate} from '../../types/crypto';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';

type CryptoListItemProps = {
  item: IExchangeRate;
};

const CryptoListItem = ({item}: CryptoListItemProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const handleCryptoPress = () => {
    navigation.navigate('Details', {cryptoId: item.id});
  };
  return (
    <Card style={styles.cryptoCard} mode="elevated" onPress={handleCryptoPress}>
      <Card.Content>
        <View style={styles.bitcoinIcon}>
          <Text style={{textAlign: 'center', color: 'white'}}>
            {item.symbol.charAt(0)}
          </Text>
        </View>
        <Text variant="titleMedium" style={styles.cryptoName}>
          {item.symbol}/USDT
        </Text>
        <Text variant="headlineSmall" style={styles.cryptoPrice}>
          {item.formatUSDValue()}
        </Text>
        <Text
          style={
            item.is24hChangePositive()
              ? styles.positiveChange
              : styles.negativeChange
          }>
          {item.get24hChange()}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  cryptoCard: {
    flex: 1,
    borderRadius: 12,
    marginTop: 10,
    marginHorizontal: 16,
  },

  bitcoinIcon: {
    backgroundColor: '#00A6FB',
    marginBottom: 12,
    width: 30,
    height: 30,
    borderRadius: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    flex: 1,
  },

  cryptoName: {
    fontWeight: '500',
    marginBottom: 4,
  },
  cryptoPrice: {
    fontWeight: '600',
    marginBottom: 4,
  },
  positiveChange: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  negativeChange: {
    color: '#F44336',
    fontWeight: '600',
  },
});

export default CryptoListItem;
