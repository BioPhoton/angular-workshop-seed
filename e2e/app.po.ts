import { browser, by, element } from 'protractor';
import {AppTestData} from './app.test-data'

export class AppPage {

  primaryNavId = 'primary-nav';
  brandNameLocator = '.navbar-brand';

  secondaryNavId = 'secondary-nav';
  linkUnitTestsId = 'link-unit-tests';
  linkE2eTestsId = 'link-e2e-tests';

  navigateTo() {
    return browser.get(AppTestData.defaultUrl);
  }

  getPrimaryNav() {
    return element(by.id(this.primaryNavId));
  }

  getBrandText() {
    return this.getPrimaryNav()
      .element(by.css(this.brandNameLocator)).getText()
  }

  getSecondaryNav() {
    return element(by.id(this.secondaryNavId));
  }

  getLinkUnitTests() {
    return element(by.id(this.linkUnitTestsId));
  }

  getLinkE2eTests() {
    return element(by.id(this.linkE2eTestsId));
  }

}
