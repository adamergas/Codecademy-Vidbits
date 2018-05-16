const router = require('express').Router();

const Video = require('../models/video');

router.get('/', async(req, res, next) => {
  const videos = await Video.find({});
  res.render('videos/index', {videos});
});

router.get('/videos/create', async (req, res, next) => {
  res.render('videos/create');
});

router.get('/videos/:videoId', async (req, res, next) => {
  const video = await Video.findById(req.params.videoId);
  res.render('videos/show', {video});
});

router.get('/videos/:videoId/edit', async (req, res, next) => {
  const video = await Video.findById(req.params.videoId);
  res.render('videos/edit', {video});
});

router.post('/videos/:videoId/updates', async (req, res, next) => {
  const {title, description, videoUrl} = req.body;
  const video = await Video.findById(req.params.videoId);
  //addn
  video.title = title;
  video.description = description;
  video.videoUrl = videoUrl;

  video.validateSync();
  if(video.errors){
    res.status(400).render('videos/edit', {error: video.errors, video: video});
  } else {
    await video.save();
    res.redirect(302, `/videos/${video._id}`);
  }
});

router.post('/videos', async (req, res, next) => {
  const {title, description, videoUrl} = req.body;
  const video = new Video({title, description, videoUrl});
  video.validateSync();
  if(video.errors){
    let errorTexts = {};
    if(video.errors.title) {
      errorTexts.title = 'title is required';
    }
    if(video.errors.videoUrl) {
      errorTexts.videoUrl = 'url is required';
    }
    res.status(400).render('videos/create', {error: errorTexts, video: video});

  } else {
    await video.save();
    res.redirect(302, `/videos/${video._id}`);
  }
});

router.post('/videos/:videoId/deletions', async (req, res, next) => {
  await Video.deleteOne({ _id: req.params.videoId});
  res.redirect(302, '/');
});

module.exports = router;
