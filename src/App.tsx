import ShareholdersTable from "./components/ShareholdersTable";
import ShareholdersChart from "./components/ShareholdersChart";
import styles from "./Index.module.scss";
import useShareholdersData from "./hooks/useShareholdersData.ts";
import Loader from "./UI/Loader";
import Error from "./UI/Error";

function App() {
    const { data, loading, error, refetch } = useShareholdersData('/data.json');

    if (loading) {
        return <Loader />
    }

    if (error) {
        return <Error refetch={refetch} error={error} />
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Структура акционеров</h1>
            <div className={styles.wrapper}>
                <ShareholdersTable data={data} />
                <ShareholdersChart data={data} />
            </div>
        </div>
    )
}

export default App
