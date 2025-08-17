import { NestFactory } from '@nestjs/core';

import { setupOpenApi } from '@core/open-api/setup-open-api';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupOpenApi(app);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
