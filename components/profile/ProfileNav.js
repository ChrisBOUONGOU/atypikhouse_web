import React from "react";
import Link from "next/link";
import { ListGroup } from "react-bootstrap";
import styles from "../../styles/components/profile/ProfileNav.module.css";

export default function ProfileNav({ source }) {
  return (
    <ListGroup className="text-center">
      <ListGroup.Item>
        <Link href="/profile/my-reservations" className={source === "reservations" ? styles.active : ""}>
         
            Mes résérvations
        
        </Link>
      </ListGroup.Item>
      <ListGroup.Item>
        <Link href="/profile/my-messages" className={source === "messages" ? styles.active : ""}>
           Messages
        </Link>
      </ListGroup.Item>
      <ListGroup.Item>
        <Link href="/profile/my-favorites" className={source === "favorites" ? styles.active : ""}>
          
            Wishlist
      
        </Link>
      </ListGroup.Item>
    </ListGroup>
  );
}
