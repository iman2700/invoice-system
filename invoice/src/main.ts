import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger configuration
  const config = new DocumentBuilder()
      .setTitle('Invoices API')
      .setDescription('API for managing invoices')
      .setVersion('1.0')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  // swagger at http://localhost:3000/api
  SwaggerModule.setup('api', app, document); 

  await app.listen(3000);
 
}
bootstrap();
