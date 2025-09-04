import styles from "../ShareholdersChart/Index.module.scss";
import React from "react";
import type {LegendItem} from "../ShareholdersChart";

interface Props {
    legendItems: LegendItem[]
    isMobile: boolean
}

const CustomLegend: React.FC<Props> = ({ legendItems, isMobile }) => {
    return (
        <>
            {legendItems.length > 0 && (
                <div className={`${styles.customLegend} ${isMobile ? styles.mobileLegend : ''}`}>
                    <div className={styles.legendList}>
                        {legendItems.map((item, index) => (
                            <React.Fragment key={index}>
                                <div className={styles.legendItem}>
                                    <div className={styles.legendColor}
                                         style={{backgroundColor: item.color}}>
                                    </div>
                                    <div className={styles.legendText}>
                                        <span className={styles.legendLabel}>{item.label}</span>
                                    </div>
                                </div>
                                {index < legendItems.length - 1 && (
                                    <div className={styles.legendDivider}></div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default CustomLegend;