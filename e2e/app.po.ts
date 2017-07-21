import { browser, by, element } from 'protractor';

export class AngularWorkshopSeedPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('.col')).getText();
  }
}
