setTimeout(async () => {
  console.log(
    '[PrUn Palette ext api test] init. Connecting to "prun-palette@prun-palette"'
  )
  const port = await browser.runtime.connect('prun-palette@prun-palette')
  console.log('[PrUn Palette ext api test] connected to port', port)
  port.postMessage({
    type: 'init',
    payload: { name: 'PrUn Palette ext api test' },
  })
}, 1000)
