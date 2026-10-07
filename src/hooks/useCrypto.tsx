import {useState, useEffect, useCallback} from 'react';
import {IExchangeRate} from '../types/crypto';
import {CryptoPortfolio} from '../services/CryptoPortfolio';
import {CoinLoreAPI} from '../services/CoinLoreAPI';

interface UseCryptoResult {
  rates: IExchangeRate[];
  portfolio: CryptoPortfolio | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  refreshing: boolean;
  hasMore: boolean;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
}

export function useCrypto(limit: number = 10): UseCryptoResult {
  const [rates, setRates] = useState<IExchangeRate[]>([]);
  const [portfolio, setPortfolio] = useState<CryptoPortfolio | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchData = useCallback(
    async (currentPage: number, isLoadMore: boolean = false): Promise<void> => {
      try {
        if (searchQuery.trim()) {
          const searchResults = await CoinLoreAPI.searchCrypto(searchQuery);
          setRates(searchResults);
          setHasMore(false);
          return;
        }

        const start = currentPage * limit;
        const fetchedRates = await CoinLoreAPI.getExchangeRates(start, limit);

        if (fetchedRates.length < limit) {
          setHasMore(false);
        }

        if (isLoadMore) {
          setRates(prevRates => [...prevRates, ...fetchedRates]);
        } else {
          setRates(fetchedRates);
          setHasMore(true);
        }

        if (!portfolio) {
          setPortfolio(new CryptoPortfolio());
        }

        setError(null);
      } catch (err) {
        setError('Something went wrong');
        console.error('Error fetching crypto data:', err);
      }
    },
    [limit, searchQuery, portfolio],
  );

  const refresh = async (): Promise<void> => {
    setRefreshing(true);
    setPage(0);
    await fetchData(0, false);
    setRefreshing(false);
  };

  const loadMore = async (): Promise<void> => {
    if (loading || !hasMore || searchQuery.trim()) {
      return;
    }

    setLoading(true);
    const nextPage = page + 1;
    await fetchData(nextPage, true);
    setPage(nextPage);
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0);
      setLoading(true);
      fetchData(0, false).finally(() => setLoading(false));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchData]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && !searchQuery.trim()) {
        fetchData(page, false);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchData, loading, page, searchQuery]);

  return {
    rates,
    portfolio,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    refreshing,
    hasMore,
    refresh,
    loadMore,
  };
}
