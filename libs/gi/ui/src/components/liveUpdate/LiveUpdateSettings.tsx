import { CardThemed } from '@genshin-optimizer/common/ui'
import { shouldShowDevComponents } from '@genshin-optimizer/common/util'
import { Box, Button, CardContent, Typography } from '@mui/material'
import { useCallback, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { LiveUpdateContext } from '../../context'
import { IsLiveUpdateConnectedDot } from './Indicators'
import type { LiveUpdateMessage } from './types'

export function LiveUpdateSettings() {
  const { isConnected } = useContext(LiveUpdateContext)
  const { t } = useTranslation('ui')
  const onClickConnect = useOnClickConnect('ws://localhost:8080')
  return (
    <CardThemed bgt="light" sx={{ m: 2 }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography>{t('liveUpdate.info')}</Typography>
        <Button onClick={onClickConnect} sx={{ alignSelf: 'flex-start' }}>
          {isConnected ? t('liveUpdate.restart') : t('liveUpdate.connect')}
        </Button>
        <Box>
          <IsLiveUpdateConnectedDot />
          <Typography display="inline">
            {isConnected
              ? t('liveUpdate.connected')
              : t('liveUpdate.disconnected')}
          </Typography>
        </Box>
        <Debug />
      </CardContent>
    </CardThemed>
  )
}

function useOnClickConnect(address: string) {
  const {
    webSocketRef,
    setIsConnected,
    setArtiQueue: setQueue,
  } = useContext(LiveUpdateContext)
  return useCallback(() => {
    if (!webSocketRef) return
    if (webSocketRef.current) webSocketRef.current.close()
    const ws = new WebSocket(address)
    ws.addEventListener('open', () => {
      setIsConnected?.(ws.readyState === WebSocket.OPEN)
    })
    ws.addEventListener('message', (event) => {
      try {
        const message: LiveUpdateMessage = JSON.parse(event.data)
        switch (message.type) {
          case 'artifact':
            setQueue((queue) => queue.concat(message.artifact))
            break
          case 'artifacts':
            setQueue((queue) => queue.concat(message.artifacts))
            break
        }
      } catch {}
    })
    ws.addEventListener('error', () => {
      setIsConnected?.(ws.readyState === WebSocket.OPEN)
    })
    ws.addEventListener('close', () => {
      setIsConnected?.(ws.readyState === WebSocket.OPEN)
    })
    webSocketRef.current = ws
    return () => {
      ws.close()
    }
  }, [webSocketRef, setIsConnected, setQueue, address])
}

function Debug() {
  const { webSocketRef } = useContext(LiveUpdateContext)
  const onClickConnect = useOnClickConnect('wss://echo.websocket.org')
  const sendOne = useCallback(
    () =>
      webSocketRef?.current?.send(
        JSON.stringify({
          type: 'artifact',
          action: 'addOrUpdate',
          artifact: {
            setKey: 'ScrollOfTheHeroOfCinderCity',
            rarity: 5,
            level: 0,
            slotKey: 'feather',
            mainStatKey: 'atk_',
            substats: [
              {
                key: 'critDMG_',
                value: 6.2,
              },
              {
                key: 'critRate_',
                value: 8.6,
              },
              {
                key: 'atk',
                value: 29,
              },
            ],
            location: 'Iansan',
            lock: true,
            unactivatedSubstats: [],
          },
        })
      ),
    [webSocketRef]
  )
  const sendMany = useCallback(
    () =>
      webSocketRef?.current?.send(
        JSON.stringify({
          type: 'artifacts',
          action: 'addOrUpdate',
          artifacts: [
            {
              setKey: 'ScrollOfTheHeroOfCinderCity',
              rarity: 5,
              level: 20,
              slotKey: 'sands',
              mainStatKey: 'atk_',
              substats: [
                {
                  key: 'critDMG_',
                  value: 6.2,
                },
                {
                  key: 'critRate_',
                  value: 8.6,
                },
                {
                  key: 'atk',
                  value: 29,
                },
                {
                  key: 'def',
                  value: 37,
                },
              ],
              location: 'Mavuika',
              lock: true,
              unactivatedSubstats: [],
            },
            {
              setKey: 'ScrollOfTheHeroOfCinderCity',
              rarity: 5,
              level: 20,
              slotKey: 'sands',
              mainStatKey: 'atk_',
              substats: [
                {
                  key: 'critDMG_',
                  value: 22.5,
                },
                {
                  key: 'critRate_',
                  value: 15.2,
                },
                {
                  key: 'atk',
                  value: 14,
                },
                {
                  key: 'def',
                  value: 21,
                },
              ],
              lock: true,
              unactivatedSubstats: [],
            },
          ],
        })
      ),
    [webSocketRef]
  )
  if (!shouldShowDevComponents) return null
  return (
    <Box display="flex" alignItems="flex-start" gap={1}>
      <Button onClick={onClickConnect}>Connect to echo server</Button>
      <Button onClick={sendOne}>Send 1 artifact</Button>
      <Button onClick={sendMany}>Send many artifacts</Button>
    </Box>
  )
}
