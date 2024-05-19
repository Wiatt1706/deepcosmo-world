import styles from "./Main.module.css";

const LoadingSpinner = (): JSX.Element => {
  return (
    <div className={styles.item}>
      <div className={styles.itme_gruop}>
        <div className={styles.itme_content}>
          <div className={styles.itme_loading}>
            <label className={styles.loadLable}></label>
            <label className={styles.loadLable}></label>
            <label className={styles.loadLable}></label>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoadingSpinner;
