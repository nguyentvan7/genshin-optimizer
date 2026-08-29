import { CardThemed, ModalWrapper } from '@genshin-optimizer/common/ui'
import { Close, Settings } from '@mui/icons-material'
import {
  Box,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import { type ReactNode, useContext, useReducer, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LiveUpdateContext } from '../../context'
import { artifactReducer } from '../artifact/editor/ArtifactReducer'
import { ArtifactLiveUpdate } from './ArtifactLiveUpdate'
import { IsLiveUpdateConnectedDot } from './Indicators'
import { LiveUpdateSettings } from './LiveUpdateSettings'

export function LiveUpdateModal() {
  const { t } = useTranslation('ui')
  const [artifact, artifactDispatch] = useReducer(artifactReducer, undefined)
  const { isModalOpen, setModalClosed, artiQueue, weapQueue, charQueue } =
    useContext(LiveUpdateContext)
  const [tab, setTab] = useState(0)
  return (
    <ModalWrapper open={isModalOpen} onClose={setModalClosed}>
      <CardThemed>
        <LiveUpdateHeader onClose={setModalClosed} />
        <Divider />
        <Tabs value={tab} onChange={(_e, v) => setTab(v)}>
          <Tab
            label={
              <Box display="flex" alignItems="center">
                <IsLiveUpdateConnectedDot />
                <Settings />
              </Box>
            }
            sx={{ minWidth: 0 }}
          />
          <Tab
            label={
              <Box display="flex" gap={1} alignItems="center">
                {t('tabs.artifacts')}
                <Chip size="small" label={artiQueue.length} />
              </Box>
            }
          />
          <Tab
            label={
              <Box display="flex" gap={1} alignItems="center">
                {t('tabs.weapons')}
                <Chip size="small" label={weapQueue.length} />
              </Box>
            }
          />
          <Tab
            label={
              <Box display="flex" gap={1} alignItems="center">
                {t('tabs.characters')}
                <Chip size="small" label={charQueue.length} />
              </Box>
            }
          />
        </Tabs>
        {tab === 0 && <LiveUpdateSettings />}
        {tab === 1 && (
          <ComponentWithFallback
            component={
              <ArtifactLiveUpdate
                artifact={artifact}
                artifactDispatch={artifactDispatch}
              />
            }
            visible={!!artiQueue.length}
          />
        )}
      </CardThemed>
    </ModalWrapper>
  )
}

function LiveUpdateHeader({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('ui')
  return (
    <CardHeader
      title={<Typography variant="h5">{t('liveUpdate.title')}</Typography>}
      action={
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      }
    />
  )
}

function ComponentWithFallback({
  component,
  visible,
}: {
  component: ReactNode
  visible: boolean
}) {
  const { t } = useTranslation('ui')
  // TODO: Improve UI
  return visible ? (
    component
  ) : (
    <CardContent>
      <Typography>{t('liveUpdate.waiting')}</Typography>
    </CardContent>
  )
}
