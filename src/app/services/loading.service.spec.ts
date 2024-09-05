import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;
  let loadingSubject: BehaviorSubject<boolean>;

  beforeEach(() => {
    loadingSubject = new BehaviorSubject<boolean>(false);
    TestBed.configureTestingModule({
      providers: [
        LoadingService,
        { provide: BehaviorSubject, useValue: loadingSubject } 
      ]
    });
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit true when show is called', () => {
    let emittedValue: boolean | undefined;
    service.loading$.subscribe(value => emittedValue = value);
    
    service.show();
    
    expect(emittedValue).toBe(true);
  });

  it('should emit false when hide is called', () => {
    let emittedValue: boolean | undefined;
    service.loading$.subscribe(value => emittedValue = value);
    
    service.hide();
    
    expect(emittedValue).toBe(false);
  });
});
