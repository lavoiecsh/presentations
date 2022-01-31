import { makeServer } from './server/makeServer';

const server = makeServer();

server.listen().then(({ url }: { url: string }) => {
    console.log(`Server ready at ${url}`);
});
