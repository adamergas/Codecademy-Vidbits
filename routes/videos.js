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

router.post('/videos', async (req, res, next) => {
  const {title, description} = req.body;
  const video = new Video({title, description});
  video.validateSync();
  if(!video.errors){
    await video.save();
    //res.status(302).render('videos/show', {video: video});
    res.redirect(302, `/videos/${video._id}`);
    /*res.render('/videos/show', {video: video}, function(err, html){
      res.status(302).send(`
        <h1>${title}</h1>
        <p>${description}</p>
      `);
    });*/
  } else {
    res.status(400).render('videos/create', {error: 'title is required', video: video});
  }

});

module.exports = router;
