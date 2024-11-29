import cookieSession from 'cookie-session';
import 'express-async-errors';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import cors from 'cors';


import express from 'express'
const bodyParser = require('body-parser');
const xss = require('xss-clean');

import * as fs from 'fs'
import * as dotenv from 'dotenv'
const path = require('path');
dotenv.config({path:path.join(__dirname, '.env')})

async function createApp(): Promise<any> {
  let app = express();

  app.use(bodyParser.json());
  app.use(
    cookieSession({
      signed: false,
      secure: false,
    }),
  );
  app.use(mongoSanitize());
  app.use(xss());

const extension = 'ts';
const routeDir = './routes';


  fs.readdirSync(__dirname + '/routes').forEach(module => {
    fs.readdirSync(__dirname + '/routes/' + module).forEach(router => {
      if (router.split('.').pop() === extension) {
        const routerPath = `${routeDir}/${module}/${router}`;
        const createdRouter = require(routerPath);
        const routerName = Object.keys(createdRouter)[0];
        app.use(createdRouter[routerName]);
      }
    });
  });

  
  app.use(hpp());
  app.use(cors());




  return app;
}

export {
  createApp
}
