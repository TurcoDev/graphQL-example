const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const users = require('./data');

// console.log(users);

const schema = buildSchema(`
  type User {
    id: ID!
    username: String!
    email: String!
    phone: String
  }

  type Query {
    getUser(id: ID!): User
    getAllUsers: [User]
  }

  type Mutation {
    createUser(username: String!, email: String!): User
    updateUser(id: ID!, username: String!, email: String!): User
    deleteUser(id: ID!): User
  }
  `)

const root = {
  getUser: ({ id }) => { users.find(user => user.id === id) },
  getAllUsers: () => users,

  createUser: ({ username, email }) => {
    const newUser = { id: String(users.length + 1), username, email };
    users.push(newUser);
    return newUser;
  },

  updateUser: ({ id, username, email }) => {
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], username, email };
      return users[userIndex];
    }

    return null;
  },

  deleteUser: ({ id }) => {
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex !== -1) {
      const deletedUser = users.splice(userIndex, 1);
      return deletedUser[0];
    }

    return null;
  },
}

const app = express();
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
)

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor GraphQL en http://localhost:${PORT}/graphql`);
});
