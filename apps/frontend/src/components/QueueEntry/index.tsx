import { QueueEntry } from "types"
import styles from './entry.module.scss'
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function QueueEntryt({
  queueEntry,
  dragStart,
  dragEnter,
  drop
}: {
  queueEntry: QueueEntry,
  dragStart: (id: number) => void,
  dragEnter: (id: number) => void,
  drop: () => void
}) {

  async function removeFromQueue(queueEntryId: number) {
    fetch(`/api/queue/${queueEntryId}`, {
      method: "DELETE"
    })
  }

  return (
  <li
    className={styles.entry}
    draggable
    onDragStart={() => dragStart(queueEntry.id)}
    onDragEnter={() => dragEnter(queueEntry.id)}
    onDragEnd={drop}
    key={queueEntry.id}
  >
    {queueEntry.action.name}
    <button onClick={() => removeFromQueue(queueEntry.id)}>
      <FontAwesomeIcon icon={faTrash} />
    </button>
  </li>
  )
}