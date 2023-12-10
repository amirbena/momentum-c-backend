import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';


async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const origin = [process.env.FRONTEND_URI,process.env.APP_URI]; 
  if (process.env.NODE_ENV == "local") {
    app.enableCors({
      origin: "*"
    })
  }

  else {
    app.use(helmet());


    if (process.env.CHECK_URI) {
      origin.push(process.env.CHECK_URI);
    }

    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      preflightContinue: false,
      optionsSuccessStatus: 204
    });
  }


  await app.listen(parseInt(process.env.PORT || "8080"));
}
bootstrap();
