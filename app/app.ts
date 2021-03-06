import * as express from 'express';
import * as http from 'http';

import * as AssetMiddleware from './middleware/asset';
import * as ErrorMiddleware from './middleware/error';
import * as PostMiddleware from './middleware/post';
import * as SecurityMiddleware from './middleware/security';

import * as Config from './config/config';
import * as SendFileAsyncMiddleware from './middleware/send-file-async';
import * as AuthenticationController from './controller/authentication';
import * as FileController from './controller/file';
import * as NoteController from './controller/note';
import * as WebsiteController from './controller/website';
import * as NoteModel from './model/note';

export const app = express();
const server = http.createServer(app);

init();

async function init() {
  app.use(SecurityMiddleware.app);
  app.use(PostMiddleware.app);
  app.use(AssetMiddleware.app);
  app.use(SendFileAsyncMiddleware.app);

  app.use(AuthenticationController.router);
  app.use(FileController.router);
  app.use(NoteController.router);
  app.use(WebsiteController.router);

  app.use(ErrorMiddleware.handle);

  server.listen(Config.PORT);
  console.log(`Server running in ${Config.MODE} mode on port ${Config.PORT} on address ${Config.URL}`);

  app.emit('initialized');

  await NoteModel.init();
}
