import Deferred from './utils/deferred'

interface ElementListener {
  match: (element: Element) => boolean,
  callback: (element: Element) => void,
  once?: boolean
  consume?: boolean
}

export default class DocumentObserver {
  private observer: MutationObserver
  private listeners: {
    added: ElementListener[],
    removed: ElementListener[],
    changed: ElementListener[],
  } = {
    added: [],
    removed: [],
    changed: [],
  }

  constructor() {
    this.observer = new MutationObserver(this.handleMutations.bind(this))
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    })
  }

  private handleMutations(mutations: MutationRecord[]) {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        for (const listener of this.listeners.added) {
          if (node instanceof Element && listener.match(node)) {
            listener.callback(node)
            if (listener.once) {
              this.removeListener('add', listener)
            }
            if (listener.consume) {
              return
            }
          }
        }
      })
    })
  }

  public addListener(on: 'add' | 'remove' | 'change', listener: ElementListener) {
    switch (on) {
      case 'add':
        this.listeners.added.push(listener)
        break
      case 'remove':
        this.listeners.removed.push(listener)
        break
      case 'change':
        this.listeners.changed.push(listener)
        break
    }
  }

  public removeListener(on: 'add' | 'remove' | 'change', listener: ElementListener) {
    switch (on) {
      case 'add':
        this.listeners.added.splice(this.listeners.added.indexOf(listener), 1)
        break
      case 'remove':
        this.listeners.removed.splice(this.listeners.removed.indexOf(listener), 1)
        break
      case 'change':
        this.listeners.changed.splice(this.listeners.changed.indexOf(listener), 1)
        break
    }
  }

  public async waitFor(selector: string, timeout: number = 1000) {
    const deferred = new Deferred<Element>()
    const listener: ElementListener = {
      match: (element) => {
        const nodeMatches = element.matches(selector)
        const nodeHadMatchingChildren = element.querySelector(selector)
        const match = nodeMatches || !!nodeHadMatchingChildren
        return match
      },
      callback: (element) => deferred.resolve(element),
      once: true,
    }

    const timer = setTimeout(() => {
      this.removeListener('add', listener)
      deferred.reject(new Error(`Timeout waiting for element matching selector '${selector}'`))
    }, timeout)

    deferred.promise.then((el) => {
      clearTimeout(timer)
      return el
    })

    this.addListener('add', listener)

    return deferred.promise
  }
}
