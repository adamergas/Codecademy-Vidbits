const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../../app');
const Video = require('../../models/video');

const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const {parseTextFromHTML} = require('../test-utils');

describe('Server Path: /videos/:id/edit', () => {
  const newVideo = { title: 'Funny Video', description: 'what a funny video!', videoUrl: 'http://example.com' };

  beforeEach(connectDatabase);

  afterEach(disconnectDatabase);

  describe('GET', () => {
    it('renders an edit form for the video', async () => {
      const video = await Video.create(newVideo);
      const response = await request(app)
        .get(`/videos/${video._id}/edit`);
      assert.include(parseTextFromHTML(response.text, '.form-title'), 'Edit a Video');
    });
  });
});

describe('Server Path: /videos/:id/updates', () => {

  beforeEach(connectDatabase);

  afterEach(disconnectDatabase);

  describe('POST', () => {
    it('updates the record', async () => {

      const newVideo = { title: 'Funny Video', description: 'what a funny video!', videoUrl: 'http://example.com' };
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(newVideo);
      const createdVideo = await Video.findOne({});
      newVideo.title = 'Updated Title';
      const updateResponse = await request(app)
        .post(`/videos/${createdVideo._id}/updates`)
        .type('form')
        .send(newVideo);
      const updatedVideo = await Video.findOne({});
      assert.include({
        title: updatedVideo.title,
      },
      {
        title: newVideo.title,
      });

    });

    it('redirects to the video\'s /show page', async () => {
      const newVideo = { title: 'Funny Video', description: 'what a funny video!', videoUrl: 'http://example.com' };
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(newVideo);
      const createdVideo = await Video.findOne({});
      newVideo.title = 'Updated Title';
      const updateResponse = await request(app)
        .post(`/videos/${createdVideo._id}/updates`)
        .type('form')
        .send(newVideo);
      const updatedVideo = await Video.findOne({});

      assert.strictEqual(response.status, 302);
      assert.equal(response.headers.location, `/videos/${updatedVideo._id}`);
    });

    it('does not save videos without titles', async () => {
      const originalTitle = 'Funny Video';
      const newVideo = { title: originalTitle , description: 'what a funny video!', videoUrl: 'http://example.com' };
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(newVideo);
      const createdVideo = await Video.findOne({});
      newVideo.title = null;
      const updateResponse = await request(app)
        .post(`/videos/${createdVideo._id}/updates`)
        .type('form')
        .send(newVideo);
      const updatedVideo = await Video.findOne({});

      assert.equal(updatedVideo.title, originalTitle);
    });

    it('returns a 400 status if the form is invalid', async () => {
      const newVideo = { title: 'Funny Video' , description: 'what a funny video!', videoUrl: 'http://example.com' };
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(newVideo);
      const createdVideo = await Video.findOne({});
      newVideo.title = null;
      const updateResponse = await request(app)
        .post(`/videos/${createdVideo._id}/updates`)
        .type('form')
        .send(newVideo);

      assert.equal(updateResponse.status, 400);
    });

    it('renders the video form if form is invalid', async () => {
      const newVideo = { title: 'Funny Video' , description: 'what a funny video!', videoUrl: 'http://example.com' };
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(newVideo);
      const createdVideo = await Video.findOne({});
      newVideo.title = null;
      const updateResponse = await request(app)
        .post(`/videos/${createdVideo._id}/updates`)
        .type('form')
        .send(newVideo);

      assert.include(updateResponse.text, 'Edit a Video');
    });

  });
});
