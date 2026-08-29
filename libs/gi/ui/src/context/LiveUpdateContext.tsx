import type {
  IArtifact,
  ICharacter,
  IWeapon,
} from '@genshin-optimizer/gi/schema'
import React, { createContext, type MutableRefObject } from 'react'
export type LiveUpdateContextObj = {
  webSocketRef: MutableRefObject<WebSocket | undefined> | undefined
  isConnected: boolean
  setIsConnected: (v: boolean) => void
  artiQueue: IArtifact[]
  setArtiQueue: React.Dispatch<React.SetStateAction<IArtifact[]>>
  weapQueue: IWeapon[]
  setWeapQueue: React.Dispatch<React.SetStateAction<IWeapon[]>>
  charQueue: ICharacter[]
  setCharQueue: React.Dispatch<React.SetStateAction<ICharacter[]>>
  isModalOpen: boolean
  setModalOpen: () => void
  setModalClosed: () => void
}
const liveUpdateContextObj = {
  webSocketRef: undefined,
  isConnected: false,
  setIsConnected: () => {},
  artiQueue: [],
  setArtiQueue: () => {},
  weapQueue: [],
  setWeapQueue: () => {},
  charQueue: [],
  setCharQueue: () => {},
  isModalOpen: false,
  setModalOpen: () => {},
  setModalClosed: () => {},
} as LiveUpdateContextObj
export const LiveUpdateContext = createContext(liveUpdateContextObj)
