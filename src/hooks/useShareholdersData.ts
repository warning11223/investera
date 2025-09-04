import { useState, useEffect } from 'react';
import axios from 'axios';

interface ShareholderData {
    holder: string;
    share_percent: string;
}

interface ProcessedShareholder {
    holder: string;
    total_percent: number;
}

export interface DataType {
    key: string;
    shareholder: string;
    percentage: string;
}

interface ApiResponse {
    SBER: ShareholderData[];
}

interface UseShareholdersDataReturn {
    data: DataType[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

const useShareholdersData = (apiUrl: string = '/data.json'): UseShareholdersDataReturn => {
    const [data, setData] = useState<DataType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Функция для удаления дубликатов и агрегации данных
    const processData = (rawData: ShareholderData[]): DataType[] => {
        const grouped = rawData.reduce((acc: ProcessedShareholder[], item) => {
            const existing = acc.find(x => x.holder === item.holder);
            if (existing) {
                existing.total_percent += parseFloat(item.share_percent);
            } else {
                acc.push({
                    holder: item.holder,
                    total_percent: parseFloat(item.share_percent)
                });
            }
            return acc;
        }, []);

        // Сортируем по убыванию процентов
        const sorted = grouped.sort((a, b) => b.total_percent - a.total_percent);

        // Преобразуем в нужный формат
        return sorted.map((item, index) => ({
            key: (index + 1).toString(),
            shareholder: item.holder,
            percentage: `${item.total_percent.toFixed(2)} %`
        }));
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get<ApiResponse>(apiUrl);

            if (!response.data.SBER || !Array.isArray(response.data.SBER)) {
                throw new Error('Неверный формат данных');
            }

            const processedData = processData(response.data.SBER);
            setData(processedData);

        } catch (err) {
            console.error('Ошибка при загрузке данных:', err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || err.message);
            } else {
                setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке данных');
            }
        } finally {
            setLoading(false);
        }
    };

    const refetch = () => {
        fetchData();
    };

    useEffect(() => {
        fetchData();
    }, [apiUrl]);

    return {
        data,
        loading,
        error,
        refetch
    };
};

export default useShareholdersData;
