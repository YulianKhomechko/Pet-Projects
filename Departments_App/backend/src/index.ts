import { sequelize } from './db/index.js';

import { server } from './socket.io/index.js';

await sequelize.sync();

server.listen(process.env.PORT, () => {
    console.log(`Server is up and running on port: ${process.env.PORT}...`);
});
