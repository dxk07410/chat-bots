import { MyprojectChatbotsPage } from './app.po';

describe('myproject-chatbots App', function() {
  let page: MyprojectChatbotsPage;

  beforeEach(() => {
    page = new MyprojectChatbotsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
