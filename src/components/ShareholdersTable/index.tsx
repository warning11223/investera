import React from 'react';
import { Table} from 'antd';
import type { TableProps } from 'antd';
import styles from './Index.module.scss';
import type {DataType} from "../../hooks/useShareholdersData.ts";
import ActualDate from "../ActualDate";

interface Props {
    data: DataType[];
}

const ShareholdersTable: React.FC<Props> = ({ data }) => {
    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Держатель акции',
            dataIndex: 'shareholder',
            key: 'shareholder',
            className: styles.shareholderColumn,
        },
        {
            title: '% Доли',
            dataIndex: 'percentage',
            key: 'percentage',
            className: styles.percentageColumn,
        },
    ];

    return (
        <div className={styles.container}>
            <Table<DataType>
                columns={columns}
                dataSource={data}
                pagination={false}
                showHeader={true}
                className={styles.table}
                size="large"
                bordered
            />
            <ActualDate className={styles.dateText} />
        </div>
    );
};

export default ShareholdersTable;