const {assert} = require('chai');

describe('When visiting /videos/edit', () => {
  describe('user can edit video details', () => {
    it('and renders the updated video', () => {
      const newVid = {
        title: 'Funny Video',
        videoUrl: 'https://www.youtube.com/watch?v=AdYaTa_lOf4',
        description: 'What a hilarious video!'
      };
      const updatedTitle = 'New Title';
      browser.url('/videos/create');

      browser.setValue('#title-input', newVid.title);
      browser.setValue('#description-input', newVid.description);
      browser.setValue('#videoUrl-input', newVid.videoUrl);
      browser.click('#submit-button');

      browser.click('#edit-button');
      browser.setValue('#title-input', updatedTitle);
      browser.click('#submit-button');

      assert.include(browser.getText('body'), updatedTitle, 'Page includes updated title.');
    });

    it('and does not create a new video', () => {
      const newVid = {
        title: 'Funny Video',
        videoUrl: 'https://www.youtube.com/watch?v=AdYaTa_lOf4',
        description: 'What a hilarious video!'
      };
      const updatedTitle = 'New Title';
      browser.url('/videos/create');

      browser.setValue('#title-input', newVid.title);
      browser.setValue('#description-input', newVid.description);
      browser.setValue('#videoUrl-input', newVid.videoUrl);
      browser.click('#submit-button');

      browser.click('#edit-button');
      browser.setValue('#title-input', updatedTitle);
      browser.click('#submit-button');

      browser.url('/');
      assert.notInclude(browser.getText('body'), newVid.title, 'Page does not include old title');
    });
  });
});
