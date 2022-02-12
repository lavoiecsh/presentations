import { makeServer } from './server/makeServer';

const server = makeServer();

server.listen({ port: 4000 })
  .then(({ url }) => {
    console.log(`Server ready at ${url}`);
  });
