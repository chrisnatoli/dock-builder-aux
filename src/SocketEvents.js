module.exports = {
  // TO SERVER
  CHECK_USERNAME:       "CHECK_USERNAME",
  USER_LOGGED_IN:       "USER_LOGGED_IN",
  USER_RECONNECTED:     "USER_RECONNECTED",
  DICE__DRAW_DIE:       "DICE__DRAW_DIE",

  // TO CLIENT
  UPDATE_USERNAME_LIST: "UPDATE_USERNAME_LIST",
  RESTORE_STATE:        "RESTORE_STATE",
  GAME_LOG_MESSAGE:     "GAME_LOG_MESSAGE",
  UPDATE_DICE:          "UPDATE_DICE",

  // BOTH (concatenated with username when sent to client)
  DICE__TAKE_DIE:       "DICE__TAKE_DIE",
  DICE__PUT_BACK:       "DICE__PUT_BACK",
};
