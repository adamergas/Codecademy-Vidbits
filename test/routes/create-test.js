const {assert} = require('chai');
const request = require('supertest');

const app = require('../../app');
const Video = require('../../models/video');

const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const {parseTextFromHTML} = require('../test-utils');

describe('Server Path: /videos', () => {
  const newVideo =  { title: 'Funny Video', description: 'what a funny video!', videoUrl: 'http://example.com' };

  beforeEach(connectDatabase);

  afterEach(disconnectDatabase);

  describe('POST', () => {
    it('redirects to the video\'s /show page', async () => {
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(newVideo);
      const createdVideo = await Video.findOne({});
      assert.equal(response.status, 302);
      assert.equal(response.headers.location, `/videos/${createdVideo._id}`);
    });

    it('creates a new video in database', async () => {
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(newVideo);
      const createdVideo = await Video.findOne({});
      assert.isOk(createdVideo, 'item not found in the database');
      assert.include({
        title: createdVideo.title,
        description: createdVideo.description,
        videoUrl: createdVideo.videoUrl,
      },
      {
        title: newVideo.title,
        description: newVideo.description,
        videoUrl: newVideo.videoUrl,
      });
    });

    it('does not save videos without titles', async () => {
      const videoNoTitle = {
        description: 'description',
        videoUrl: 'http://example.com'
      };
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(videoNoTitle);
      const videos = await Video.find({});
      assert.equal(videos.length, 0);
    });

    it('returns a 400 status if the title is missing', async () => {
      const videoNoTitle = {
        description: 'description',
        videoUrl: 'http://example.com'
      };
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(videoNoTitle);
      assert.equal(response.status, 400);
    });

    it('renders the video form if title is empty', async () => {
      const videoNoTitle = {
        description: 'description',
        videoUrl: 'http://example.com'
      };
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(videoNoTitle);
      assert.include(response.text, 'Save a Video');
    });

    it('renders an error message when title is empty', async () => {
      const videoNoTitle = {
        description: 'description',
        videoUrl: 'http://example.com'
      };
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(videoNoTitle);
      assert.include(parseTextFromHTML(response.text, 'form'), 'title is required');
    });

    it('preserves other fields when title is missing', async () => {
      const videoNoTitle = {
        description: 'description',
        videoUrl: 'http://example.com'
      };
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(videoNoTitle);
      assert.include(parseTextFromHTML(response.text, 'form'), videoNoTitle.description);
      assert.include(response.text, videoNoTitle.videoUrl);
    });

    it('renders an error message when videoUrl is empty', async () => {
      const videoNoUrl = {
        title: 'coolvid1',
        description: 'what a cool vid!',
      };
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(videoNoUrl);
      assert.include(parseTextFromHTML(response.text, 'form'), 'url is required');
    });
  });
});
