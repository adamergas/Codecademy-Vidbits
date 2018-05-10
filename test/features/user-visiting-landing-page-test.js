const {assert} = require('chai');

describe('User visits root', () => {
  describe('When the database is empty', () => {
    it('should be blank', () => {
      browser.url('/');
      assert.equal(browser.getText('#videos-container'), '');
    });
  });

  describe('and can navigate', () => {
    it('to videos/create.html', () => {
      browser.url('/');
      browser.click('a[href="/videos/create"]');
      assert.include(browser.getText('body'), 'Save a Video');
    });
  });

  describe('when a video exists in the database', () => {
    it('renders the videos', () => {
      const testTitle = 'TESTING'
      browser.url('/videos/create');

      browser.setValue('#title-input', testTitle);
      browser.click('#submit-button');
      browser.url('/');

      assert.include(browser.getText('#videos-container'), testTitle);
    });
  })
});
