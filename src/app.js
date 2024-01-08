const express = require('express');
const app = express();
const config = require("./config");
const { queueConsumer } = require("./consumers/sitemap.consumer");

// queueConsumer.start();
app.get('/',(req,res)=>res.json({message:'pong'}))
app.use(require('./routes'))

console.log(new Date().toISOString());
app.listen(config.APP_PORT, () => {
    console.info(
      `Server running on http://${config.APP_HOST}:${config.APP_PORT}`
    );
  });
