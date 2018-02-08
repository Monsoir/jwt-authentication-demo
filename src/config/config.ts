const JWTConfig = {
  jwtSecret: 'secret', // 用于 encode 和 decode token
  jwtSession: {
    session: false, // 禁用 session
  },
};

export {
  JWTConfig,
};