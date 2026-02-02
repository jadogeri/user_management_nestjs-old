import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './configs/swagger.config';
import { globalValidationPipe } from './configs/validation-pipe.config';
import helmet from 'helmet';
import { corsOptions } from './configs/cors.config';
import { helmetOptions } from './configs/helmet.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document); // The documentation will be available at http://localhost:3000/docs
  app.use(helmet(helmetOptions)); // Adds security-related HTTP headers
  app.enableCors(corsOptions); // Configures CORS with specified options
  app.useGlobalPipes(globalValidationPipe);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();



