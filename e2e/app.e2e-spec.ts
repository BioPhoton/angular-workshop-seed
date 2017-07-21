import { AngularWorkshopSeedPage } from './app.po';

describe('angular-workshop-seed App', () => {
  let page: AngularWorkshopSeedPage;

  beforeEach(() => {
    page = new AngularWorkshopSeedPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Home works!');
  });
});
