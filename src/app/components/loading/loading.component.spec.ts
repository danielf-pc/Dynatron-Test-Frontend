import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { LoadingComponent } from './loading.component';
import { LoadingService } from 'src/app/services/loading.service';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;
  let loadingSubject: Subject<boolean>;

  beforeEach(() => {
    loadingSubject = new Subject<boolean>();
    mockLoadingService = jasmine.createSpyObj('LoadingService', [], {
      loading$: loadingSubject.asObservable()
    });

    TestBed.configureTestingModule({
      declarations: [LoadingComponent],
      providers: [
        { provide: LoadingService, useValue: mockLoadingService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to loading$ observable from LoadingService', () => {
    let loadingState: boolean | undefined;
    component.loading$.subscribe(value => {
      loadingState = value;
    });
    loadingSubject.next(true);
    expect(loadingState).toBe(true);
    loadingSubject.next(false);
    expect(loadingState).toBe(false);
  });
});
