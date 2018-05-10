const {assert} = require('chai');

describe('When visiting /videos/create.html', () => {
  describe('user can post new video', () => {
    it('and renders the new video on the landing page', () => {
      const newVid = {
        title: 'Funny Video',
        videoUrl: 'https://www.youtube.com/watch?v=AdYaTa_lOf4',
        description: 'What a hilarious video!'
      };
      browser.url('/videos/create');

      browser.setValue('#title-input', newVid.title);
      browser.setValue('#description-input', newVid.description);
      browser.setValue('#videoUrl-input', newVid.videoUrl);
      browser.click('#submit-button');

      assert.include(browser.getText('body'), newVid.title);
      assert.include(browser.getText('body'), newVid.description);
    })
  });
});
