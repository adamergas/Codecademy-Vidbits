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

  describe('videoUrl', () => {
    it('is a string', () => {
      const videoUrlAsInt = 1;
      const video = new Video({videoUrl: videoUrlAsInt});
      assert.strictEqual(video.videoUrl, videoUrlAsInt.toString());
    });

    it('is required', async () => {
      const video = new Video({});
      const videos = await Video.find({});
      assert.strictEqual(videos.length, 0);
    });
  });
});
