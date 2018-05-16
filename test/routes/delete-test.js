const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../../app');
const Video = require('../../models/video');

const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const {parseTextFromHTML} = require('../test-utils');

describe('Server Path: /videos/:videoId/deletions', () => {
  const newVideo =  { title: 'Funny Video', description: 'what a funny video!', videoUrl: 'http://example.com' };

  beforeEach(connectDatabase);

  afterEach(disconnectDatabase);

  describe('POST', () => {
    it('deletes the selected video', async () => {

      const newVideo = { title: 'Deleted Video', description: 'what a funny video!', videoUrl: 'http://example.com' };
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(newVideo);
      const createdVideo = await Video.findOne({});

      const deleteResponse = await request(app)
        .post(`/videos/${createdVideo._id}/deletions`)
        .type('form')
        .send(newVideo);

      const videos = await Video.find({});
      assert.equal(videos.length, 0);

      assert.strictEqual(deleteResponse.status, 302);
      assert.equal(deleteResponse.headers.location, '/');


    });
  });
});
