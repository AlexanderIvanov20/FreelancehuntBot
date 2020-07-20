const cleanUpChatMiddleware = async (ctx, next) => {
  await next();
};

module.exports = { cleanUpChatMiddleware };
