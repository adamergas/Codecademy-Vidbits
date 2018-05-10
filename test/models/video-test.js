const {assert} = require('chai');
const Video = require('../../models/video');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

describe('Model: Video', () => {
  beforeEach(connectDatabase);

  afterEach(disconnectDatabase);

  describe('title', () => {
    it('is a string', () => {
      const titleAsInt = 1;
      const video = new Video({title: titleAsInt});
      assert.strictEqual(video.title, titleAsInt.toString());
    });
  });
});
