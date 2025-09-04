import styles from "../../Index.module.scss";
import {Spin} from "antd";

const Loader = () => {
    return (
        <div className={styles.container}>
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '16px' }}>Загрузка данных...</div>
            </div>
        </div>
    );
};

export default Loader;