import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import * as cookieParser from 'cookie-parser'

async function start() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  })
  const configService = new ConfigService()
  const PORT = configService.getOrThrow<number>('PORT')

  app.setGlobalPrefix('api')
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors({
    origin: configService.get<string>('CLIENT_URL'),
    credentials: true,
  })

  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
}
start()
