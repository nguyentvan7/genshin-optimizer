import { useBoolState } from '@genshin-optimizer/common/react-util'
import type {
  IArtifact,
  ICharacter,
  IWeapon,
} from '@genshin-optimizer/gi/schema'
import { type ReactNode, useRef, useState } from 'react'
import { LiveUpdateContext, type LiveUpdateContextObj } from '../context'

export function LiveUpdateProvider({ children }: { children: ReactNode }) {
  const webSocketRef = useRef<WebSocket | undefined>(undefined)
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [artiQueue, setArtiQueue] = useState<IArtifact[]>([])
  const [weapQueue, setWeapQueue] = useState<IWeapon[]>([])
  const [charQueue, setCharQueue] = useState<ICharacter[]>([])
  const [isModalOpen, setModalOpen, setModalClosed] = useBoolState(false)
  const liveUpdateContextObj: LiveUpdateContextObj = {
    webSocketRef,
    isConnected,
    setIsConnected,
    artiQueue,
    setArtiQueue,
    weapQueue,
    setWeapQueue,
    charQueue,
    setCharQueue,
    isModalOpen,
    setModalOpen,
    setModalClosed,
  }
  return (
    <LiveUpdateContext.Provider value={liveUpdateContextObj}>
      {children}
    </LiveUpdateContext.Provider>
  )
}
