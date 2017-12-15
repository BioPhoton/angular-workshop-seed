import { AppPage } from './app.po';
import {Utils} from './utils'
import {AppTestData} from './app.test-data'

describe('AppComponent', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should navigate to unit-tests by default', done => {
    page.navigateTo();
    expect(Utils.isUrlPresent(AppTestData.defaultUrl)).toBeTruthy();
    done();
  })

  it('should display app primary navbar', done => {
    expect(page.getPrimaryNav().isDisplayed()).toBeTruthy();
    done();
  })

  it('should display app name', done => {
    expect(page.getBrandText()).toEqual(AppTestData.brandName);
    done();
  })

  it('should display the links', done => {
    expect(page.getLinkUnitTests().isDisplayed()).toBeTruthy();
    expect(page.getLinkE2eTests().isDisplayed()).toBeTruthy();
    done();
  })

});
