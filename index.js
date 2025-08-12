require('dotenv').config({ path: './config/.env' });
const express = require('express')
const app = express()
app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser());
require('./config/db');

const PORT = process.env.PORT || 3000;

const RoleSeed = require('./seed/role')
RoleSeed();
const startWorker = require('./services/workers')
startWorker();

const userRouter = require('./routers/user');
const accountRouter = require('./routers/accounts');
const accountMemberRouter = require('./routers/members');
const destinationRouter = require('./routers/destination');
const webhooks = require('./routers/hook')
const logRouter = require('./routers/logs')

app.use(userRouter)
app.use('/accounts', accountRouter)
app.use('/accounts/members', accountMemberRouter)
app.use('/accounts/destination', destinationRouter)
app.use('/logs', logRouter)

app.use(webhooks)

app.listen(PORT, () => {
    console.log(`Server started @ ${PORT}`);
});
