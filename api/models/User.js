const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    id: { type: String, required: true },
    steamid: { type: String, required: true },
    username: { type: String, required: true },
    tradeurl: { type: String, default: '' },
    profilePic: { type: Object, required: true },
    notifications: { type: Array, default: [] },
    trades: { type: Array, default: [] },
    comments: [{ tradeid: { type: String, required: true }, id: { type: String, required: true } }],
    isPremium: { type: Boolean, default: false },
    isDonator: { type: Boolean, default: false },
    donated: { type: Number, default: 0 },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
