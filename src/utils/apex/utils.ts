import Apex from "../../apex";

export default abstract class ApexUtils {
  constructor(protected apex: Apex) {}

  private findElementWithContent(parent: Element, content: string): Element | null {
    const elements = Array.from(parent.querySelectorAll('*'))
    return elements.find((element) => {
      return element.textContent?.trim() === content
    }) ?? null
  }

  public closeBuffer(buffer: Element) {
    const closeButton = this.findElementWithContent(buffer, 'x')
    if (!closeButton || !(closeButton instanceof HTMLElement)) return

    closeButton.click()
  }
}
