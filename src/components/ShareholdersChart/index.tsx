import * as Chart from 'chart.js';
import styles from './Index.module.scss';
import React, {useRef, useEffect, useState} from 'react';
import type {DataType} from '../../hooks/useShareholdersData';
import {useMediaQuery} from "../../hooks/useMediaQuery.ts";
import {generateColors} from "../../utils/generate-colors.ts";
import EmptyChart from "../../UI/EmptyChart";
import CustomLegend from "../CustomLegend";
import type {TooltipItem} from "chart.js";

Chart.Chart.register(
    Chart.ArcElement,
    Chart.Tooltip,
    Chart.Legend,
    Chart.Title,
    Chart.DoughnutController
);

export interface LegendItem {
    label: string;
    percentage: string;
    color: string;
}

interface Props {
    data: DataType[];
}

const ShareholdersChart: React.FC<Props> = ({data}) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart.Chart | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const isMobile = useMediaQuery('(max-width: 768px)');

    const [legendItems, setLegendItems] = useState<LegendItem[]>([]);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const handleMouseLeave = () => {
        setHoveredIndex(null);
        if (chartInstanceRef.current) {
            const colors = generateColors(data.length);
            chartInstanceRef.current.data.datasets[0].backgroundColor = colors;
            chartInstanceRef.current.update('active');
        }
    };

    useEffect(() => {
        if (!chartRef.current || !data.length) return;

        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;

        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        // Преобразуем данные для Chart.js
        const labels = data.map(item => item.shareholder);
        const values = data.map(item => parseFloat(item.percentage.replace(' %', '')));
        const colors = generateColors(data.length);

        // Создаем данные для кастомной легенды
        const legendData: LegendItem[] = data.map((item, index) => ({
            label: item.shareholder,
            percentage: item.percentage,
            color: colors[index]
        }));

        setLegendItems(legendData);

        // Данные для диаграммы
        const chartData = {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors,
                borderWidth: 0,
                cutout: '60%',
            }]
        };

        // Конфигурация графика
        const config = {
            type: 'doughnut' as const,
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                onHover: (event: Chart.ChartEvent, elements: Chart.ActiveElement[], chart: Chart.Chart) => {
                    const newHoveredIndex = elements.length > 0 ? elements[0].index : null;

                    if (newHoveredIndex !== hoveredIndex) {
                        setHoveredIndex(newHoveredIndex);

                        const dataset = chart.data.datasets[0];

                        if (newHoveredIndex !== null) {
                            const newBackgroundColors = colors.map((color, index) => {
                                return index === newHoveredIndex ? color : color + '30';
                            });
                            dataset.backgroundColor = newBackgroundColors;

                            if (event.native && event.native.target instanceof HTMLElement) {
                                event.native.target.style.cursor = 'pointer';
                            }
                        } else {
                            dataset.backgroundColor = colors;

                            if (event.native && event.native.target instanceof HTMLElement) {
                                event.native.target.style.cursor = 'default';
                            }
                        }

                        chart.update('active');
                    }
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context: TooltipItem<'doughnut'>) {
                                const label = context.label || '';
                                const value = context.parsed;
                                return `${label}: ${value.toFixed(2)}%`;
                            }
                        },
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                        borderWidth: 1,
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 1000
                },
                layout: {
                    padding: isMobile ? 10 : 20
                }
            }
        };

        chartInstanceRef.current = new Chart.Chart(ctx, config);

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [data, isMobile]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!chartRef.current) return;

            const canvas = chartRef.current;
            const rect = canvas.getBoundingClientRect();

            const isOnCanvas = (
                event.clientX >= rect.left &&
                event.clientX <= rect.right &&
                event.clientY >= rect.top &&
                event.clientY <= rect.bottom
            );

            if (!isOnCanvas) {
                handleMouseLeave();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!data.length) {
        return <EmptyChart />
    }

    return (
        <div className={styles.container} ref={containerRef}>
            <div className={`${styles.wrapper} ${isMobile ? styles.mobile : ''}`} >
                <canvas
                    ref={chartRef}
                    className={styles.canvas}
                    onMouseLeave={handleMouseLeave}
                    onTouchEnd={handleMouseLeave}
                />

                <CustomLegend
                    legendItems={legendItems}
                    isMobile={isMobile}
                />
            </div>
        </div>
    );
};

export default ShareholdersChart;