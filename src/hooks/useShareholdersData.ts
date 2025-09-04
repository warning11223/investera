import { useState, useEffect } from 'react';
import axios from 'axios';

interface ShareholderData {
    holder: string;
    share_percent: string;
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

    // Функция для удаления дубликатов и нормализации данных до 100%
    const processData = (rawData: ShareholderData[]): DataType[] => {
        const uniqueHoldersMap = new Map<string, number>();

        let totalSum = 0;

        for (const item of rawData) {
            if (!uniqueHoldersMap.has(item.holder)) {
                const percent = parseFloat(item.share_percent);
                uniqueHoldersMap.set(item.holder, percent);
                totalSum += percent;
            }
        }

        const needsNormalization = Math.abs(totalSum - 100) > 0.01;
        const factor = needsNormalization ? 100 / totalSum : 1;

        return Array.from(uniqueHoldersMap)
            .map(([holder, total_percent], index) => {
                const normalizedPercent = needsNormalization
                    ? parseFloat((total_percent * factor).toFixed(3))
                    : total_percent;

                return {
                    holder,
                    total_percent: normalizedPercent,
                    originalIndex: index
                };
            })
            .sort((a, b) => b.total_percent - a.total_percent)
            .map((item, index) => ({
                key: (index + 1).toString(),
                shareholder: item.holder,
                percentage: `${item.total_percent.toFixed(3)} %`
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