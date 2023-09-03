// データベースにアクセスするためのクライアントライブラリ
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const main = async () => {
  const newLink = await prisma.link.create({
    data: {
      description: "GraphQLチュートリアルをUdemyで学ぶ",
      url: "www.hacker.com",
    },
  });
  const allLinks = await prisma.link.findMany();
};

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    prisma.$disconnect();
  });
