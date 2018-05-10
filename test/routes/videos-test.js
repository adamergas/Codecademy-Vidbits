const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../../app');
const Video = require('../../models/video');

const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const {parseTextFromHTML} = require('../test-utils');

describe('Server Path: /', () => {
  const newVideo =  { title: 'Funny Video', description: 'what a funny video!' };

  beforeEach(connectDatabase);

  afterEach(disconnectDatabase);

  describe('GET', () => {
    it('renders existing Videos', async () => {
      const video = Video.create(newVideo);
      const response = await request(app)
        .get('/');

      assert.include(parseTextFromHTML(response.text, '.video-title'), newVideo.title);
      assert.include(parseTextFromHTML(response.text, '.video-description'), newVideo.description);
    });
  });
});
