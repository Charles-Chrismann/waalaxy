import { Credit } from "types";
import styles from './action.module.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
import rocket from '../../assets/rocket.svg';

function addActionToQueue(actionId: number) {
  fetch('/api/queue', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      actionId
    })
  })
}

export default function Action({
    credit,
    historyCount
  }:{
    credit: Credit,
    historyCount: number | undefined
  }) {

  return (
    <li
      key={credit.action.id}
      className={styles.card}
    >
      <span className={styles.name}>{credit.action.name}</span>
      <div className={styles.datas}>
        <div className={styles.data}>
          <div className={styles.numbers}>
            <FontAwesomeIcon icon={faCheck} className={styles["icon-success"]} />
            <span>{credit.creditsCount}/{credit.action.maxCreditsCount}</span>
          </div>
          <span>Crédits disponnibles</span>
        </div>
        <div className={styles.data}>
          <div className={styles.numbers}>
            <FontAwesomeIcon icon={faClockRotateLeft} className={styles["icon-danger"]} />
            <span>{historyCount ?? 0}</span>
          </div>
          <span>Actions effectuées</span>
        </div>
      </div>
      <button type="button" onClick={() => addActionToQueue(credit.action.id)}>
          <img className={styles.icon} src={rocket} alt="available icon" />
        Ajouter
      </button>
    </li>
  )
}