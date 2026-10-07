import {useState, useEffect, useCallback} from 'react';
import {CoinLoreAPI} from '../services/CoinLoreAPI';
import {CryptoDetails} from '../services/CryptoDetailts';

interface UseCryptoDetailsResult {
  details: CryptoDetails | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useCryptoDetails(cryptoId: string): UseCryptoDetailsResult {
  const [details, setDetails] = useState<CryptoDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async () => {
    try {
      setLoading(true);
      const cryptoDetails = await CoinLoreAPI.getCryptoDetails(cryptoId);
      setDetails(cryptoDetails);
      setError(null);
    } catch (err) {
      setError('Error loading cryptocurrency details');
      console.error('Error fetching crypto details:', err);
    } finally {
      setLoading(false);
    }
  }, [cryptoId]);

  useEffect(() => {
    fetchDetails();

    // Set up periodic refresh
    const interval = setInterval(fetchDetails, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [fetchDetails]);

  const refresh = async () => {
    await fetchDetails();
  };

  return {
    details,
    loading,
    error,
    refresh,
  };
}
