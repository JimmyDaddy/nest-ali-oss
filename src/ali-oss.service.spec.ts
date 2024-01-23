import { Test, TestingModule } from '@nestjs/testing';
import { AliOssService } from './ali-oss.service';

describe('AliOssService', () => {
  let service: AliOssService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AliOssService],
    }).compile();

    service = module.get<AliOssService>(AliOssService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
