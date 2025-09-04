import React from 'react';

interface Props {
    className: string;
}

const ActualDate: React.FC<Props> = ({ className }) => {
    const currentDate = new Date();

    const formattedDate = currentDate.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    return (
        <p className={className ? className : ""}>
            Дата последнего обновления этой структуры: {formattedDate}
        </p>
    );
};

export default ActualDate;