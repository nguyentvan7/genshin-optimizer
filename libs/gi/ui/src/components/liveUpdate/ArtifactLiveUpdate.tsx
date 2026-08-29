import { useDataManagerValues } from '@genshin-optimizer/common/database-ui'
import { CardThemed } from '@genshin-optimizer/common/ui'
import { cachedArtifact, type ICachedArtifact } from '@genshin-optimizer/gi/db'
import { useDatabase } from '@genshin-optimizer/gi/db-ui'
import type { IArtifact } from '@genshin-optimizer/gi/schema'
import { Add, ChevronRight, Replay, Update } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  CardContent,
  Grid,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  type Dispatch,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { LiveUpdateContext } from '../../context'
import { ArtifactCardObj } from '../artifact/ArtifactCard'
import type { ArtifactReducerMessage } from '../artifact/editor/ArtifactReducer'

export function ArtifactLiveUpdate({
  artifact,
  artifactDispatch,
}: {
  artifact: IArtifact | undefined
  artifactDispatch: Dispatch<ArtifactReducerMessage>
}) {
  return (
    <Suspense fallback={<Skeleton width="100%" height="100%" />}>
      <LiveUpdateContent
        artifact={artifact}
        artifactDispatch={artifactDispatch}
      />
    </Suspense>
  )
}

function LiveUpdateContent({
  artifact,
  artifactDispatch,
}: {
  artifact: IArtifact | undefined
  artifactDispatch: Dispatch<ArtifactReducerMessage>
}) {
  const { artiQueue: queue, setArtiQueue: setQueue } =
    useContext(LiveUpdateContext)
  const database = useDatabase()
  const theme = useTheme()
  const grmd = useMediaQuery(theme.breakpoints.up('md'))
  const { t } = useTranslation(['ui', 'artifact'])

  // When there are queued artifacts and no artifact in editor, put the latest queue in the editor
  useEffect(() => {
    if (!queue.length || artifact) return
    const qArti = queue[0]
    if (!qArti) return
    artifactDispatch({
      type: 'overwrite',
      artifact: qArti,
    })
  }, [queue, artifact, artifactDispatch])
  // Validate artifact
  const cArtifact = useMemo(
    () => artifact && cachedArtifact(artifact, ''),
    [artifact]
  )
  const isValid = !cArtifact?.errors.length
  // Check for dupe/upgrade
  const artValuesDirty = useDataManagerValues(database.arts)
  const {
    old,
    oldType,
  }: {
    old: ICachedArtifact | undefined
    oldType: 'duplicate' | 'upgrade' | ''
  } = useMemo(() => {
    if (artifact === undefined) return { old: undefined, oldType: '' }
    const { duplicated, upgraded } =
      artValuesDirty && database.arts.findDups(artifact)
    if (!duplicated.length && !upgraded.length)
      return { old: undefined, oldType: '' }
    return {
      old: duplicated[0] ?? upgraded[0],
      oldType: duplicated.length !== 0 ? 'duplicate' : 'upgrade',
    }
  }, [artifact, database, artValuesDirty])

  const reset = useCallback(() => {
    artifactDispatch({ type: 'reset' })
    setQueue(queue.slice(1))
  }, [artifactDispatch, setQueue, queue])
  const clearQueue = useCallback(() => {
    setQueue(queue.slice(0, 1))
  }, [setQueue, queue])
  const remaining = Math.max(queue.length - 1, 0)

  return (
    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Grid container sx={{ justifyContent: 'space-evenly' }} gap={1}>
        {/* Duplicate/Upgraded UI */}
        {old && (
          <>
            {/* Old artifact card */}
            <Grid
              item
              xs={12}
              md={5.5}
              lg={4}
              display="flex"
              justifyContent="center"
            >
              <CardThemed bgt="light">
                <Typography
                  sx={{ textAlign: 'center' }}
                  py={1}
                  variant="h6"
                  color="text.secondary"
                >
                  {oldType === ''
                    ? t('artifact:editor.newArt')
                    : oldType === 'duplicate'
                      ? t('artifact:editor.dupArt')
                      : t('artifact:editor.upArt')}
                </Typography>
                <Box>
                  <ArtifactCardObj artifact={old} />
                </Box>
              </CardThemed>
            </Grid>
            {/* Chevron */}
            <Grid
              item
              md={1}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <CardThemed bgt="light" sx={{ display: 'flex' }}>
                <ChevronRight
                  sx={{ fontSize: 40, rotate: grmd ? undefined : '90deg' }}
                />
              </CardThemed>
            </Grid>
          </>
        )}
        {/* Artifact from live update, take up full space if no dupe/upgrade detected */}
        <Grid
          item
          xs={12}
          md={old ? 5.5 : 12}
          lg={old ? 4 : 12}
          display="flex"
          justifyContent="center"
        >
          <CardThemed bgt="light">
            <Typography
              sx={{ textAlign: 'center' }}
              py={1}
              variant="h6"
              color="text.secondary"
            >
              {t('artifact:editor.preview')}
            </Typography>
            <Box>
              {cArtifact && <ArtifactCardObj artifact={cArtifact.artifact} />}
            </Box>
          </CardThemed>
        </Grid>

        {!isValid && (
          <Alert variant="filled" severity="error">
            {cArtifact.errors.map((e, i) => (
              <div key={i}>{e}</div>
            ))}
          </Alert>
        )}
      </Grid>

      {/* Bottom Row */}
      <Box display="flex" gap={2} alignItems="center">
        {oldType === 'upgrade' ? (
          <Button
            startIcon={<Add />}
            onClick={() => {
              artifact && database.arts.set(old!.id, artifact)
              reset()
            }}
            disabled={!artifact || !isValid}
            color="primary"
          >
            {t('artifact:editor.btnSave')}
          </Button>
        ) : (
          <Button
            startIcon={<Add />}
            onClick={() => {
              database.arts.new(artifact!)
              reset()
            }}
            disabled={!artifact || !isValid}
            color={oldType === 'duplicate' ? 'warning' : 'primary'}
          >
            {t('artifact:editor.btnAdd')}
          </Button>
        )}
        {old && oldType !== '' && (
          <Button
            startIcon={<Update />}
            onClick={() => {
              artifact && database.arts.set(old.id, artifact)
              reset()
            }}
            disabled={!artifact || !isValid}
            color="success"
          >
            {t('artifact:editor.btnUpdate')}
          </Button>
        )}
        <Button
          startIcon={<Replay />}
          disabled={!artifact}
          onClick={reset}
          color="error"
        >
          {t('artifact:editor.btnClear')}
        </Button>
        <Box flexGrow={1} />
        <Trans
          t={t}
          ns="ui"
          i18nKey="liveUpdate.queue"
          values={{ count: remaining }}
        >
          {{ count: remaining }} additional items waiting for action
        </Trans>
        <Button disabled={!queue.length} color="error" onClick={clearQueue}>
          {t('ui:liveUpdate.clearQueue')}
        </Button>
      </Box>
    </CardContent>
  )
}
