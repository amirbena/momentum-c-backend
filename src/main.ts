import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as awsServerlessExpress from 'aws-serverless-express';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import * as https from 'https';
import helmet from 'helmet';


async function bootstrap() {


  if (process.env.NODE_ENV == "local") {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: [process.env.FRONTEND_URI]
    })
    return await app.listen(parseInt(process.env.PORT));
  }

  const httpsOptions: https.AgentOptions = {
    key: readFileSync(resolve(process.cwd(), "src", 'crypto/key.pem')),
    cert: readFileSync(resolve(process.cwd(), "src", 'crypto/cert.pem')),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.use(helmet());
  const origin = [process.env.FRONTEND_URI];
  
  if (process.env.CHECK_URI) {
    origin.push(process.env.CHECK_URI);
  }
  
  app.enableCors({
    origin
  })

  console.log(process.env.PORT);
  await app.listen(parseInt(process.env.PORT || "8080"));
}
bootstrap();
