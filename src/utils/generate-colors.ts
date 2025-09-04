export const generateColors = (count: number): string[] => {
    const baseColors = [
        '#60BFFC', // Голубой
        '#FF6B6B', // Красный
        '#FFD93D', // Желтый
        '#6BCF7F', // Зеленый
        '#A855F7', // Фиолетовый
        '#FF8A65', // Оранжевый
        '#26C6DA', // Циан
        '#AB47BC', // Розовый
        '#66BB6A', // Светло-зеленый
        '#FFA726'  // Янтарный
    ];

    return Array.from({length: count}, (_, i) => baseColors[i % baseColors.length]);
};