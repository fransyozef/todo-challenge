import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// tslint:disable-next-line:no-console
console.log("env" , process.env["PRISMA_ENDPOINT"]);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
