import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SettingsDialogComponent } from './settings-dialog.component';
import { ConfigService } from 'src/app/services/config.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SettingsDialogComponent', () => {
  let component: SettingsDialogComponent;
  let fixture: ComponentFixture<SettingsDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<SettingsDialogComponent>>;
  let mockConfigService: jasmine.SpyObj<ConfigService>;

  beforeEach(() => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    
    mockConfigService = jasmine.createSpyObj('ConfigService', [], {
      baseUrl: 'http://localhost:8080/api/customers'
    });

    Object.defineProperty(mockConfigService, 'baseUrl', {
      set: (url: string) => {
        (mockConfigService as any)._baseUrl = url;
      },
      get: () => (mockConfigService as any)._baseUrl
    });

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, BrowserAnimationsModule],
      declarations: [SettingsDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: ConfigService, useValue: mockConfigService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have baseUrl form control with correct validators', () => {
    const baseUrlControl = component.settingsForm.get('baseUrl') as FormControl;

    expect(baseUrlControl).toBeTruthy();
    const validatorFn = baseUrlControl.validator;
    expect(validatorFn).toBeTruthy();

    const callValidators = (value: any) => {
      const control = new FormControl(value);
      return validatorFn ? validatorFn(control) : null;
    };

    let errors = callValidators('');
    expect(errors).toBeTruthy();
    if (errors) {
      expect(errors['required']).toBeTruthy();
    }

    errors = callValidators('http://example.com');
    expect(errors).toBeNull();

    errors = callValidators('invalid-url');
    expect(errors).toBeTruthy();
    if (errors) {
      expect(errors['pattern']).toBeTruthy();
    }
  });

  it('should call dialogRef.close() on onCancel', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should call dialogRef.close() with the updated baseUrl on onConfirm', () => {
    component.settingsForm.setValue({ baseUrl: 'http://updated-url.com' });
    component.onConfirm();
    expect(mockConfigService.baseUrl).toBe('http://updated-url.com');
    expect(mockDialogRef.close).toHaveBeenCalledWith('http://updated-url.com');
  });

  it('should not call dialogRef.close() with invalid baseUrl on onConfirm', () => {
    component.settingsForm.setValue({ baseUrl: '' });
    component.onConfirm();
    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });
});
