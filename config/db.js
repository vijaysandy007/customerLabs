const mongoose = require('mongoose')
console.log("MONGOOSE_URL", process.env.MONGOOSE_URL)

mongoose.connect(process.env.MONGOOSE_URL)