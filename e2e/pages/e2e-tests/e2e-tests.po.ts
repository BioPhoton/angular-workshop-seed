import { browser, by, element } from 'protractor';
import {E2eTestsTestData} from './e2e-tests.test-data'

export class E2eTestsPage {

  loginStateId = 'login-state';

  loginFormId = 'my-form';
  usernameInputId = 'my-form--username';
  passwordInputId = 'my-form--password';
  loginButtonId = 'my-form--login-button'

  navigateTo() {
    return browser.get(E2eTestsTestData.baseUrl);
  }

  getLoginFrom() {
    return element(by.id(this.loginFormId));
  }

  getLoginState() {
    return element(by.id(this.loginStateId)).getText()
  }

  getUsernameInput() {
    return element(by.id(this.usernameInputId))
  }

  enterUsername(input) {
    const usernameInput = element(by.id(this.usernameInputId))
    usernameInput.clear();
    return usernameInput.sendKeys(input)
  }

  getPasswordInput() {
    return element(by.id(this.passwordInputId))
  }

  enterPassword(input) {
    this.getPasswordInput().clear();
    return this.getPasswordInput().sendKeys(input)
  }

  getLoginButton() {
    return element(by.id(this.loginButtonId))
  }

  sendLoginForm() {
    return this.getLoginButton().click()
  }

}
