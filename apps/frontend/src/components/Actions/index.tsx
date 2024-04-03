import { Credit, HistoryEntry } from "types"
import Action from "../Action"
import styles from './actions.module.scss'

export default function Actions({
    credits,
    history
  }:{
    credits: Credit[],
    history: HistoryEntry[]
  }) {
  return (
    <ul className={styles.actions}>
      {
        credits.map(credit => <Action key={credit.id} credit={credit} historyCount={history.find(entry => entry.actionId === credit.action.id)?._count} />)
      }
    </ul>
  )
}