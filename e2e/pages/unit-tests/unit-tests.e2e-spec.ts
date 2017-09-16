import {UnitTestsPage} from './unit-tests.po';
import {UnitTestsTestData} from './unit-tests.test-data'
import {Utils} from '../../utils'

describe('UnitTestsComponent', () => {
  let page: UnitTestsPage;

  beforeEach(() => {
    page = new UnitTestsPage();
  });

  it('should navigate to unit-tests by default', done => {
    page.navigateTo();
    expect(Utils.isUrlPresent(UnitTestsTestData.baseUrl)).toBeTruthy();
    done();
  })

});
