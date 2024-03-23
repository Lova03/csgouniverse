const verify = require('../helpers/verify');
const Trade = require('../models/Trade');
const User = require('../models/User');
const { v4 } = require('uuid');
const Filter = require('bad-words');
const filter = new Filter();

const commentsRouter = require('express').Router();

commentsRouter.post('/', verify, async (req, res, next) => {
  // req.user = await User.findOne({ id: '766820f3-2313-4eaa-881b-11b7b1dc12d0' });
  // console.log(req.user);
  const { content, tradeid } = req.body;
  if (!content) return res.status(400).json({ success: false, msg: 'No message content provided' });
  if (!tradeid) return res.status(400).json({ success: false, msg: 'No trade ID provided' });

  const existingTrade = await Trade.findOne({ id: tradeid });

  const timesCommented =
    existingTrade.comments?.filter((comment) => comment.authorId === req.user.id)?.length || 0;

  if (timesCommented > 2 && !req.user.isAdmin && !req.user.isPremium)
    return res
      .status(401)
      .json({ success: false, msg: "You've reached your max amount of comments. (2)" });

  if (timesCommented > 5 && !req.user.isAdmin)
    return res
      .status(401)
      .json({ success: false, msg: "You've reached your max amount of comments. (5)" });

  const commentId = v4();

  const newComment = {
    id: commentId,
    content: filter.clean(content),
    date: new Date().getTime(),
    authorName: req.user.username,
    authorId: req.user.id,
    authorIsPremium: req.user.isPremium,
    authorIsAdmin: req.user.isAdmin,
    authorPic: req.user.profilePic,
  };

  await Trade.findOneAndUpdate(
    { id: tradeid },
    { $push: { comments: { $each: [newComment], $position: 0 } } }
  );

  await User.findOneAndUpdate(
    { id: req.user.id },
    { $push: { comments: { tradeid: tradeid, id: commentId } } }
  );

  res.status(201).json({ success: true, data: newComment });
});

module.exports = commentsRouter;
