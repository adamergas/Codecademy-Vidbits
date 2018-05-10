const {assert} = require('chai');
const request = require('supertest');

const app = require('../../app');
const Video = require('../../models/video');

const {parseTextFromHTML} = require('../test-utils');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

describe('Server path: /videos/:id', () => {
  beforeEach(connectDatabase);

  afterEach(disconnectDatabase);

  // Write your test blocks below:
  describe('GET', () => {
    it('renders the selected video', async () => {
      const video = await Video.create({
        title: 'Best Video',
        description: 'Best Description'
      });
      
      const response = await request(app)
        .get(`/videos/${video._id}`);

      assert.include(parseTextFromHTML(response.text, '#video-title'), video.title);
      assert.include(parseTextFromHTML(response.text, '#video-description'), video.description);
    });
  });
});
