import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.scss'
import { socket } from './socket';
import { ActionBase } from 'types';

function App() {
  const [count, setCount] = useState(0)
  const [actions, setAction] = useState<ActionBase[]>([])
  const [actionsQueue, setActionsQueue] = ([])
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);

  useEffect(() => {
    fetch('/api/actions')
    .then(res => res.json())
    .then((res: ActionBase[]) => {
      console.log(res)
      setAction(res)
    })
  }, [])

  useEffect(() => {
    fetch('/api/actions')
    .then(res => res.json())
    .then((res) => {
      console.log(res)
      setActionsQueue(res)
    })
  }, [])

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []); 

  return (
    <>
      <ul>
        {
          actions && actions.map(action => <li key={action.id}>{action.name}</li>)
        }
      </ul>
    </>
  )
}

export default App
