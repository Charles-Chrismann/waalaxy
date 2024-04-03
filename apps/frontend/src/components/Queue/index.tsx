import { useRef } from "react";
import { QueueEntry } from "types";
import QueueEntryComponent from "../QueueEntry";
import styles from './queue.module.scss'

export default function Queue({actionsQueue, setActionsQueue}:{actionsQueue: QueueEntry[], setActionsQueue: (queue: QueueEntry[]) =>  void}) {
  const dragItem = useRef<number | null>(null);
  const dragOver = useRef<number | null>(null);
  function dragStart(id: number) {
    dragItem.current = id;
  }

  function dragEnter(id: number) {
    dragOver.current = id;
  }

  async function drop() {
    const movedId = dragItem.current
    const beforeId = dragOver.current
    await fetch('/api/queue/reorder', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        movedId,
        beforeId
      })
    })
    const copy = [...actionsQueue]
    const toDeleteIndex = copy.findIndex(item => item.id === dragItem.current)
    const toAddIndex = copy.findIndex(item => item.id === dragOver.current)
    const dragItemContent = copy.find(item => item.id === dragItem.current)!
    copy.splice(toDeleteIndex, 1)
    copy.splice(toAddIndex, 0, dragItemContent)
    dragItem.current = null
    dragOver.current = null
    setActionsQueue(copy)
  }

  return (
    <ul className={styles.queue}>
      {
        actionsQueue.map(action =>
          <QueueEntryComponent
          key={action.id}
          queueEntry={action}
          dragEnter={dragEnter}
          dragStart={dragStart}
          drop={drop}
          />
        )
      }
    </ul>
  )
}