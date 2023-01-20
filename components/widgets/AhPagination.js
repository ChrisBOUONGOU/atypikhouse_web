import Pagination from "react-bootstrap/Pagination";
import styles from "../../styles/widgets/AhPagination.module.css";

export default function AhPagination(props) {
  return <Pagination total={props.total} sizes={[9]} theme={styles} />;
}
