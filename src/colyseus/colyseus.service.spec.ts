import { Test, TestingModule } from '@nestjs/testing';
import { ColyseusService } from './colyseus.service';

describe('ColyseusService', () => {
  let service: ColyseusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ColyseusService],
    }).compile();

    service = module.get<ColyseusService>(ColyseusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
