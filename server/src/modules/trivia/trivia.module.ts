import { Module } from '@nestjs/common';
import { TriviaService } from './trivia.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        timeout: config.get('OPENTDB_TIMEOUT'),
      }),
    }),
  ],
  providers: [TriviaService],
  exports: [TriviaService],
})
export class TriviaModule {}
