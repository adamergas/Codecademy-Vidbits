const {assert} = require('chai');

const generateRandomUrl = (domain) => {
  return `http://${domain}/${Math.random()}`;
};

const submitVideo = (title, url) => {
  browser.url('/videos/create');

  browser.setValue('#title-input', title);
  browser.setValue('#videoUrl-input', url);
  browser.click('#submit-button');
  browser.url('/');
};

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
      const testUrl = generateRandomUrl('localhost:4001');
      submitVideo(testTitle, testUrl);

      assert.include(browser.getText('#videos-container'), testTitle);
      assert.include(browser.getAttribute('.video-player', 'src'), testUrl);
    });

    it('can navigate to that video', () => {
      const testTitle = 'TESTING'
      const testUrl = generateRandomUrl('localhost:4001');
      submitVideo(testTitle, testUrl);
      browser.click(`#${testTitle}`);

      assert.include(browser.getText('#video-title'), testTitle);
    });

  })
});
