import { settingsStore } from '../../../settings/settings-store'
import { compress, decode, decompress, encode } from '../../../utils/data'
import { div, p } from '../../../utils/dom'
import { ButtonType, apexButton } from '../../elements/buttons'
import { fromLine } from '../../elements/form'
import { textInput } from '../../elements/text-input'

interface ImportExportSettingsProps {
  rerender: () => void
}
export function importExportSettings({ rerender }: ImportExportSettingsProps) {
  const settingsInputField = textInput('', { styles: 'width: 90%' })
  const importButton = apexButton(ButtonType.Primary, 'IMPORT', async () => {
    const state = JSON.parse(
      await decompress(decode(settingsInputField.value), 'gzip')
    )

    console.debug('[PrUn Palette](Import settings)', state)

    settingsStore.merge(state)
    rerender()
  })
  const exportButton = apexButton(ButtonType.Primary, 'EXPORT', async () => {
    settingsInputField.value = encode(
      await compress(JSON.stringify(settingsStore.State), 'gzip')
    )
  })

  return div(
    p('Import or export your setting.'),
    p(
      'Very useful if you have more than one computer or if you are changing browsers.'
    ),
    p(
      "To export your settings, click the 'EXPORT' button and copy the text that shows up in the 'Settings' field."
    ),
    p(
      "To import, paste any text you got from an export into the 'Settings' field and click the 'IMPORT' button."
    ),
    fromLine({ label: 'Settings', input: settingsInputField }),
    fromLine({ label: 'Action', input: div(importButton, exportButton) })
  )
}
