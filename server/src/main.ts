import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = process.env.PORT || 8001;

async function start() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT, async () => {
    console.log(`Application is running on: ${await app.getUrl()}`);
  });
}
start();
