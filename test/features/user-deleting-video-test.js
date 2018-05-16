const {assert} = require('chai');

describe('When visiting /videos/deletions', () => {
  describe('user can delete video', () => {
    it('and the video is removed from the list', () => {
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

      browser.click('#delete');

      assert.notInclude(browser.getText('body'), newVid.title, 'deleted video is not in the list.');

    });
  });
});
