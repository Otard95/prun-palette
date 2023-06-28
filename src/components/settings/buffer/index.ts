import { settingsStore } from '../../../settings/settings-store'
import { div, p } from '../../../utils/dom'
import { checkboxButton } from '../../elements/checkbox-button'
import { fromLine } from '../../elements/form'

export function bufferSettings() {
  return div(
    p('Experimental feature'),
    fromLine({ label: 'Remember buffer size', input: rememberSize() }),
    fromLine({ label: 'Remember buffer position', input: rememberPosition() })
  )
}

function rememberSize() {
  return checkboxButton({
    checked: settingsStore.get('rememberBufferSize') ?? false,
    label: 'Remember',
    onChange: () => {
      settingsStore.set(
        'rememberBufferSize',
        !settingsStore.get('rememberBufferSize')
      )
    },
  })
}

function rememberPosition() {
  return checkboxButton({
    checked: settingsStore.get('rememberBufferPosition') ?? false,
    label: 'Remember',
    onChange: () => {
      settingsStore.set(
        'rememberBufferPosition',
        !settingsStore.get('rememberBufferPosition')
      )
    },
  })
}
