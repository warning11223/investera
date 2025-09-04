import styles from "../../Index.module.scss";
import {Alert, Button} from "antd";
import {ReloadOutlined} from "@ant-design/icons";
import React from "react";

interface Props {
    error: string;
    refetch: () => void;
}

const Error: React.FC<Props> = ({ error, refetch }) => {
    return (
        <div className={styles.container}>
            <Alert
                message="Ошибка загрузки данных"
                description={error}
                type="error"
                showIcon
                style={{ margin: '20px 0' }}
                action={
                    <Button
                        size="small"
                        icon={<ReloadOutlined />}
                        onClick={refetch}
                    >
                        Повторить
                    </Button>
                }
            />
        </div>
    );
};

export default Error;