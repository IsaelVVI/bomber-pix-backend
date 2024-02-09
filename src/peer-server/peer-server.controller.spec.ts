import { Test, TestingModule } from '@nestjs/testing';
import { PeerServerController } from './peer-server.controller';

describe('PeerServerController', () => {
  let controller: PeerServerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeerServerController],
    }).compile();

    controller = module.get<PeerServerController>(PeerServerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
