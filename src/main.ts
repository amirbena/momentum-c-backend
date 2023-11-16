import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as awsServerlessExpress from 'aws-serverless-express';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import * as https from 'https';
import * as cors from 'cors';
import helmet from 'helmet';

const server = express();
const expressAdapter = new ExpressAdapter(server);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, expressAdapter);


  if (process.env.NODE_ENV == "local") {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: [process.env.FRONTEND_URI]
    })
    return await app.listen(parseInt(process.env.PORT));
  }

  const httpsOptions = {
    key: readFileSync(resolve(process.cwd(), "src", 'crypto/key.pem')),
    cert: readFileSync(resolve(process.cwd(), "src", 'crypto/cert.pem')),
  };

  server.use(helmet());
  server.use(cors({
    origin: [process.env.FRONTEND_URI]
  }))

  server.use('*', (req, res) => {
    return app.getHttpAdapter().getInstance()(req, res);
  });

 

  https.createServer(httpsOptions, server).listen(process.env.PORT || 3000, () => {
    console.log(`NestJS application listening on port ${process.env.PORT || 3000}`);
  });
}
bootstrap();
