import styles from "../../components/ShareholdersChart/Index.module.scss";

const EmptyChart = () => {
    return (
        <div className={`${styles.container} ${styles.empty}`}>
            <div className={styles.emptyContent}>
                <div className={styles.emptyIcon}>📊</div>
                <div>Нет данных для отображения</div>
            </div>
        </div>
    );
};

export default EmptyChart;