import { browser, by, element } from 'protractor';
import {UnitTestsTestData} from './unit-tests.test-data'

export class UnitTestsPage {

  navigateTo() {
    return browser.get(UnitTestsTestData.baseUrl);
  }

}
