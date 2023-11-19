import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { readFileSync } from 'fs';
import { AgentOptions } from 'https';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const origin = [process.env.FRONTEND_URI];
  if (process.env.NODE_ENV == "local") {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin
    })
  }

  else {
    app.use(helmet());


    if (process.env.CHECK_URI) {
      origin.push(process.env.CHECK_URI);
    }

     app.enableCors({
       origin
     })
  }

  await app.listen(parseInt(process.env.PORT || "8080"));
}
bootstrap();
