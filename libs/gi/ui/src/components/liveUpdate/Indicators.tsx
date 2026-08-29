import { Sensors, SensorsOff } from '@mui/icons-material'
import { Box } from '@mui/material'
import { useContext } from 'react'
import { LiveUpdateContext } from '../../context'

export function IsLiveUpdateConnectedDot() {
  const { isConnected } = useContext(LiveUpdateContext)
  return (
    <Box
      display="inline-block"
      width="12px"
      height="12px"
      mr={1}
      sx={{
        borderRadius: 4,
        ...(isConnected
          ? {
              backgroundColor: '#11ae00',
              animation: 'pulse 3s infinite ease-in-out',
              '@keyframes pulse': {
                '0%, 100%': {
                  backgroundColor: '#11ae00',
                },
                '50%': {
                  backgroundColor: '#0a6300',
                },
              },
            }
          : { backgroundColor: '#cd9d00' }),
      }}
    />
  )
}

export function IsLiveUpdateConnectedIcon() {
  const { isConnected } = useContext(LiveUpdateContext)
  return isConnected ? (
    <Sensors
      sx={{
        fill: '#11ae00',
        animation: 'pulseFill 3s infinite ease-in-out',
        '@keyframes pulseFill': {
          '0%, 100%': {
            fill: '#11ae00',
          },
          '50%': {
            fill: '#0a6300',
          },
        },
      }}
    />
  ) : (
    <SensorsOff />
  )
}
