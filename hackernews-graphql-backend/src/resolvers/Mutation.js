const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET } = require("../utils");

async function signup(parent, args, context) {
  const password = await bcrypt.hash(args.password, 10);

  // ユーザ新規作成
  const user = await context.prisma.user.create({
    data: {
      ...args,
      password,
    },
  });

  //暗号化
  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  return {
    token,
    user,
  };
}

async function login(parent, args, context) {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });
  if (!user) {
    throw new Error("そのようなエラーは存在しません");
  }
  //passwordの比較
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("無効なパスワードです");
  }
  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  return {
    token,
    user,
  };
}

// ニュースを投稿するリゾルバ
async function post(parent, args, context) {
  const { userId } = context;
  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    },
  });
  // 送信
  context.pubsub.publish("NEW_LINK", newLink);
  return newLink;
}

async function vote(parent, args, context) {
  const { userId } = context;
  // const vote = context.prisma.vote.findUnique({
  //   where: {
  //     linkId_userId: {
  //       linkId: Number(args.linkId),
  //       userId: userId,
  //     },
  //   },
  // });

  // //重複投票を防ぐ
  // if (Boolean(vote)) {
  //   throw new Error(`既にその投稿には投票されています:${args.linkId}`);
  // }
  //投票する
  const newVote = context.prisma.vote.create({
    data: {
      user: { connect: { id: userId } },
      link: { connect: { id: Number(args.linkId) } },
    },
  });
  context.pubsub.publish("NEW_VOTE", newVote);
  return newVote;
}

module.exports = {
  signup,
  login,
  post,
  vote,
};
