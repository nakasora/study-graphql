const { JsonWebTokenError } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const APP_SECRET = "GraphQL";

//トークンを複合するための関数
function getTokenPayload(token) {
  //トークン化されたものの前の情報
  return jwt.verify(token, APP_SECRET);
}
// ユーザDを取得するための関数
function getUserId(req, authToken) {
  if (req) {
    // ヘッダーを確認
    const authHeader = req.headers.authorization;
    // 権限があるなら
    if (authHeader) {
      const token = authHeader.replace("Bearer", "");
      if (!token) {
        throw new Error("トークンが見つかりませんでした");
      }
      //そのトークンを複合する
      const { userId } = getTokenPayload(token);
      return userId;
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(authToken);
    return userId;
  }
  throw new Error("認証権限がありません");
}
module.exports = {
  APP_SECRET,
  getUserId,
};
