const Post = require('../models/post');

const fs = require('fs');
const post = require('../models/post');

exports.getAllPost = (req, res, next) => {
  Post.find().then(
    (posts) => {
      res.status(200).json(posts);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getOnePost = (req, res, next) => {
  Post.findOne({
    _id: req.params.id
  }).then(
    (post) => {
      res.status(200).json(post);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.createPost = (req, res, next) => {
  const postObject = JSON.parse(req.body.post);
  delete postObject._id;
  delete postObject._userId;
  const post = new Post({
    ...postObject,
    userId: req.auth.userId,
    // imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });

  post.save()
    .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
    .catch(error => { res.status(400).json({ error }) })
};

exports.modifyPost = (req, res, next) => {
  const postObject = req.file ? {
    ...JSON.parse(req.body.post),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  delete postObject._userId;
  Post.findOne({ _id: req.params.id })
    .then((post) => {
      if (post.userId != req.auth.userId) {
        res.status(403).json({ message: 'Unauthorized request' });
      } else {
        Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet modifié!' }))
          .catch(error => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deletePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then(post => {
      if (post.userId != req.auth.userId) {
        res.status(403).json({ message: 'Unauthorized request' });
      } else {
        const filename = post.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Post.deleteOne({ _id: req.params.id })
            .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
            .catch(error => res.status(401).json({ error }));
        });
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};

exports.notePost = (req, res, next) => {
  let like = req.body.like;
  console.log(like);
  let userId = req.body.userId;

  switch (like) {

    case 1:
      Post.updateOne(
        { _id: req.params.id },
        { $push: { usersLiked: userId }, $inc: { likes: +1 } }
      )
        .then(() => res.status(200).json({ message: 'I like' }))
        .catch((error) => res.status(400).json({ error }))
      break;

    case 0:
      Post.findOne({ _id: req.params.id })
        .then((post) => {
          if (post.usersLiked.includes(userId)) {
            Post.updateOne(
              { _id: req.params.id },
              { $unset: { usersLiked: userId }, $inc: { likes: -1 } })
              .then(() => res.status(200).json({ message: 'I don\t know if I like or dislike' })
              )
              .catch((error) => res.status(400).json({ error }))
          }
          if (post.usersDisliked.includes(userId)) {
            Post.updateOne(
              { _id: req.params.id },
              { $unset: { usersDisliked: userId }, $inc: { dislikes: -1 } }
            )
              .then(() => res.status(200).json({ message: 'I don\t know if I like or dislike' }))
              .catch((error) => res.status(400).json({ error }))
          }
        })
        .catch((error) => res.status(404).json({ error }))
      break;

    case -1:
      Post.updateOne(
        { _id: req.params.id },
        { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } }
      )
        .then(() => res.status(200).json({ message: 'I don\'t like' }))
        .catch((error) => res.status(400).json({ error }))
      break;

    default:
      console.log(error);
  }
}


