import {browser} from 'protractor'
export class Utils {
  //to wait for url use it like this => browser.driver.wait(isUrlPresent('my/url'), 5000);
  public static async isUrlPresent(matcherUrl: string) {
      const actualUrl = await browser.getCurrentUrl()
      return actualUrl.indexOf(matcherUrl) !== -1
  }

  public static async isInputValid(inputElement) {
    const className = await inputElement.getAttribute('class')
    return className.indexOf('ng-valid') !== -1
  }

  public static async getInputValue(inputElement) {
    const value = await inputElement.getAttribute('value');
    return value;
  }
}
