import { useEffect, useState } from 'react'
import './App.scss'
import { socket } from './socket';
import { Credit, HistoryEntry, QueueEntry } from 'types';
import Actions from './components/Actions';
import Queue from './components/Queue';

function App() {
  const [credits, setCredits] = useState<Credit[]>([])
  const [actionsQueue, setActionsQueue] = useState<QueueEntry[]>([])
  const [history, setHistory] = useState<HistoryEntry[]>([])

  useEffect(() => {
    fetch('/api/credits')
    .then(res => res.json())
    .then((res: Credit[]) => {
      setCredits(res)
    })
    fetch('/api/queue')
    .then(res => res.json())
    .then((res: QueueEntry[]) => {
      setActionsQueue(res)
    })
    fetch('/api/history')
    .then(res => res.json())
    .then((res: HistoryEntry[]) => {
      setHistory(res)
    })
  }, [])

  function onQueueEntryCreation(ev: QueueEntry) {
    setActionsQueue(prevActionsQueue => [...prevActionsQueue, ev])
  }

  function onCkeckedActions(ev: {toDecrementId: number | null, actions: number[]}) {
    if(ev.toDecrementId !== null) {
      setCredits(prev => prev.map(credit => {
        if (credit.id === ev.toDecrementId) return { ...credit, creditsCount: credit.creditsCount - 1 }
        return credit
      }))
      setHistory(prev => {
        const newHistory = structuredClone(prev)
        const entryToUpdate = newHistory.find(entry => entry.actionId === ev.toDecrementId)
        if(entryToUpdate) entryToUpdate._count += 1
        else newHistory.push({actionId: ev.toDecrementId as number, _count: 1})
        return newHistory
      })
    }
    setActionsQueue(prev => prev.filter(action => !ev.actions.includes(action.id)))
  }

  function onCreditsUpdate(ev: Credit[]) {
    setCredits(ev)
  }
  useEffect(() => {

    socket.on('queueEntry creation', onQueueEntryCreation)
    socket.on('checked actions', onCkeckedActions)
    socket.on('creditsUpdate', onCreditsUpdate)

    return () => {
      socket.off('queueEntry creation', onQueueEntryCreation)
      socket.off('checked actions', onCkeckedActions)
      socket.off('creditsUpdate', onCreditsUpdate)
    };
  }, []); 

  return (
    <>
      <Actions
        credits={credits}
        history={history}
      />
      <Queue actionsQueue={actionsQueue} setActionsQueue={setActionsQueue} />
    </>
  )
}

export default App
