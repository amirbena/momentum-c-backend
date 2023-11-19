import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { readFileSync } from 'fs';
import { AgentOptions } from 'https';
import { INestApplication } from '@nestjs/common';
import { resolve } from 'path';

async function bootstrap() {

  let app: INestApplication<any>;
  const origin = [process.env.FRONTEND_URI];
  if (process.env.NODE_ENV == "local") {
    app = await NestFactory.create(AppModule);
    app.enableCors({
      origin
    })
  }

  else {

    const httpsOptions: AgentOptions = {
      ca: readFileSync(resolve(process.cwd(), 'src', 'crypto/cert')),
      key: readFileSync(resolve(process.cwd(), 'src', 'crypto/key'))
    }
    app = await NestFactory.create(AppModule);
    app.use(helmet());


    if (process.env.CHECK_URI) {
      origin.push(process.env.CHECK_URI);
    }

    /*  app.enableCors({
       origin
     }) */
  }

  await app.listen(parseInt(process.env.PORT || "8080"));
}
bootstrap();
