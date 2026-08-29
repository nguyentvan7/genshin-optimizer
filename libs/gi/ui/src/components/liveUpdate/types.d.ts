export type LiveUpdateAction = 'addOrUpdate' | 'delete'
export type SingleArtifactUpdateMessage = {
  type: 'artifact'
  action: LiveUpdateAction
  artifact: IArtifact
}
export type MultipleArtifactUpdateMessage = {
  type: 'artifacts'
  action: LiveUpdateAction
  artifacts: IArtifact[]
}
export type LiveUpdateMessage =
  | SingleArtifactUpdateMessage
  | MultipleArtifactUpdateMessage
