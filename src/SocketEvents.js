module.exports = {
  // TO SERVER
  CHECK_USERNAME:       "CHECK_USERNAME",
  USER_LOGGED_IN:       "USER_LOGGED_IN",
  USER_RECONNECTED:     "USER_RECONNECTED",

  // TO CLIENT
  UPDATE_USERNAME_LIST: "UPDATE_USERNAME_LIST",
  USER_DATA:            "USER_DATA",
  GAME_LOG_MESSAGE:     "GAME_LOG_MESSAGE",

  // BOTH (concatenated with username when sent to client)
  DICE__SET_DIE:        "DICE__SET_DIE",
  DICE__TAKE_DIE:       "DICE__TAKE_DIE",
  DICE__PUT_BACK:       "DICE__PUT_BACK",
};
