import { PointoPage } from './app.po';

describe('pointo App', () => {
  let page: PointoPage;

  beforeEach(() => {
    page = new PointoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
