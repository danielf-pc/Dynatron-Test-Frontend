import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CustomerService } from './customer.service';
import { ConfigService } from './config.service';
import { ApiResponse } from 'src/app/models/customer.model';

describe('CustomerService', () => {
  let service: CustomerService;
  let httpMock: HttpTestingController;
  let configService: ConfigService;

  beforeEach(() => {
    const configServiceMock = {
      baseUrl: 'http://mock-api.com/customers'
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CustomerService,
        { provide: ConfigService, useValue: configServiceMock }
      ]
    });

    service = TestBed.inject(CustomerService);
    httpMock = TestBed.inject(HttpTestingController);
    configService = TestBed.inject(ConfigService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle errors when retrieving customers', () => {
    service.getCustomers('').subscribe(
      () => fail('expected an error, not customers'),
      error => expect(error).toBeTruthy()
    );

    const req = httpMock.expectOne(configService.baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });

  it('should create a customer', () => {
    const mockResponse: ApiResponse = {
      message: 'success',
      statusCode: 200,
      data: JSON.stringify(1)  // return the created customer's ID
    };

    const newCustomer = { firstName: 'Jane', lastName: 'Doe' };

    service.create(newCustomer).subscribe(customerId => {
      expect(customerId).toBe(1);
    });

    const req = httpMock.expectOne(configService.baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should delete a customer by ID', () => {
    const mockResponse: ApiResponse = {
      message: 'success',
      statusCode: 200,
      data: ''
    };

    service.delete(1).subscribe(success => {
      expect(success).toBeTrue();
    });

    const req = httpMock.expectOne(`${configService.baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('should delete all customers', () => {
    const mockResponse: ApiResponse = {
      message: 'success',
      statusCode: 200,
      data: ''
    };

    service.deleteAll().subscribe(success => {
      expect(success).toBeTrue();
    });

    const req = httpMock.expectOne(configService.baseUrl);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
