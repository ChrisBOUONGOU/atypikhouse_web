import { Modal } from "react-bootstrap";
import styles from "../../styles/widgets/AhModal.module.css";

export default function AhModal({ show, toggleDisplay, children }) {
  return (
    <Modal
      contentClassName={styles.modalContent}
      size="xl"
      centered
      show={show}
      onHide={() => toggleDisplay(false)}
    >
      {children}
    </Modal>
  );
}
