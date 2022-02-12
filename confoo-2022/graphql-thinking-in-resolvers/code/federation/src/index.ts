import { makeServer } from './server/makeServer';

const server = makeServer();

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
