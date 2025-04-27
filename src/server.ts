import { init, server } from './index';

init().then((port) => {
    server.listen(port, () => {
        console.log(`Server is listening on PORT: ${port}`);
    });
});
