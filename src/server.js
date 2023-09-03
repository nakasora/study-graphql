const { ApolloServer, gql } = require("apollo-server");
//HackerNewsの1つ1つの投稿
let links = [
  {
    id: "link-0",
    description: "GraphQLチュートリアルをUdemyで学ぶ",
    url: "www.graphql.com",
  },
];
// GraphQLのスキーマ定義
// !はNULL禁止の意味i.e必須
const typeDefs = gql`
  type Query {
    info: String!
    feed: [Link]!
  }
  type Link {
    id: ID!
    description: String!
    url: String!
  }
`;
//リゾルバ関数
// 型に何か実態をいれる
const resolvers = {
  Query: {
    info: () => "HackerNewsクローン",
    feed: () => links,
  },
  // Link: {
  //   info: () => "HackerNewsクローン",
  // },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => console.log(`${url}でサーバを起動中`));
