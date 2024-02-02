import { Test, TestingModule } from '@nestjs/testing';
import { BomberpixGateway } from './bomberpix.gateway';

describe('BomberpixGateway', () => {
  let gateway: BomberpixGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BomberpixGateway],
    }).compile();

    gateway = module.get<BomberpixGateway>(BomberpixGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
