import {E2eTestsPage} from './e2e-tests.po';
import {E2eTestsTestData} from './e2e-tests.test-data'
import {Utils} from '../../utils'

describe('UnitTestsComponent', () => {
  let page: E2eTestsPage;

  beforeEach(() => {
    page = new E2eTestsPage();
  });

  it('should navigate to unit-tests by default', done => {
    page.navigateTo();
    expect(Utils.isUrlPresent(E2eTestsTestData.baseUrl)).toBeTruthy();
    done();
  })

  it('should display username input', done => {
    expect(page.getUsernameInput().isDisplayed()).toBeTruthy();
    done();
  });

  it('should fill out the username valid', done => {
    page.enterUsername(E2eTestsTestData.validUsername);

    expect(Utils.getInputValue(page.getUsernameInput())).toBe(E2eTestsTestData.validUsername);

    expect(Utils.isInputValid(page.getUsernameInput())).toBeTruthy();

    done();
  });

  it('should display password input', done => {
    expect(page.getPasswordInput().isDisplayed()).toBeTruthy();
    done();
  });


  it('should fill out the password valid', async done => {
    page.enterPassword(E2eTestsTestData.validPassword);

    expect(Utils.getInputValue(page.getPasswordInput())).toBe(E2eTestsTestData.validPassword)

    expect(Utils.isInputValid(page.getPasswordInput())).toBeTruthy();

    done();
  });


  it('should be able to login', done => {
    expect(page.getLoginState()).toEqual(E2eTestsTestData.loginStateNegativeText);
    page.sendLoginForm();
    expect(page.getLoginState()).toEqual(E2eTestsTestData.loginStatePositiveText);
    done();
  });

});
