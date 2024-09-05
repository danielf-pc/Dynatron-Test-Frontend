import { TestBed } from '@angular/core/testing';
import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get a new baseUrl', () => {
    const newUrl = 'http://localhost:8080/api/new-customers';
    service.baseUrl = newUrl;
    expect(service.baseUrl).toBe(newUrl);
  });
});
