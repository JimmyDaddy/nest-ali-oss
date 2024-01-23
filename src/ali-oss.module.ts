import { Global, Module } from '@nestjs/common';
import { AliOssService } from './ali-oss.service';
import { ALI_OSS_OPTIONS } from './contants';
import { AliOSSOptions } from './interface';

@Global()
@Module({
  providers: [AliOssService],
  exports: [AliOssService],
})
export class AliOssModule {
  public static forRoot(options: AliOSSOptions): {
    module: typeof AliOssModule;
    providers: {
      provide: string;
      useValue: AliOSSOptions;
    }[];
  } {
    return {
      module: AliOssModule,
      providers: [
        {
          provide: ALI_OSS_OPTIONS,
          useValue: options,
        },
      ],
    };
  }
}
