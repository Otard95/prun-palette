interface AddCommandMessage {
  type: 'add-command'
  name: string
  description: string
  signature: string[]
  id: string
}

interface RemoveCommandMessage {
  type: 'remove-command'
  id: string
}

interface ExecuteCommandMessage {
  type: 'execute-command'
  id: string
  variables: unknown[]
}

export type ToPrUnPaletteMessage = AddCommandMessage | RemoveCommandMessage

export type FromPrUnPaletteMessage = ExecuteCommandMessage
