import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule, FormsModule, NgForm } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { CustomerFormDialogComponent } from './customer-form-dialog.component';
import { CustomerService } from 'src/app/services/customer.service';
import { LoadingService } from 'src/app/services/loading.service';
import { AppConstants, FormType } from 'src/app/app.constants';
import { Customer } from 'src/app/models/customer.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CustomerFormDialogComponent', () => {
  let component: CustomerFormDialogComponent;
  let fixture: ComponentFixture<CustomerFormDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<CustomerFormDialogComponent>>;
  let mockCustomerService: jasmine.SpyObj<CustomerService>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;

  beforeEach(() => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockCustomerService = jasmine.createSpyObj('CustomerService', ['create', 'update']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockLoadingService = jasmine.createSpyObj('LoadingService', ['show', 'hide']);

    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,  // Add this line
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule  // Add MatInputModule if you use <input matInput>
      ],
      declarations: [CustomerFormDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { formType: FormType.CREATE } },
        { provide: CustomerService, useValue: mockCustomerService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: LoadingService, useValue: mockLoadingService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with formType CREATE', () => {
    expect(component.formType).toBe(FormType.CREATE);
    expect(component.title).toBe(AppConstants.FORM_CREATE_TITLE);
    expect(component.submitButtonLabel).toBe(AppConstants.FORM_BUTTON_LABEL[0]);
  });

  it('should handle form submission for creating a customer', () => {
    const customer: Customer = { id: 0, firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com' };
    component.customer = customer;

    mockCustomerService.create.and.returnValue(of(customer.id));
    spyOn(component, 'createCustomer').and.callThrough();

    component.handleFormSubmission({ valid: true } as NgForm);

    expect(mockLoadingService.show).toHaveBeenCalled();
    expect(component.createCustomer).toHaveBeenCalled();
    expect(mockCustomerService.create).toHaveBeenCalledWith(customer);
    expect(mockDialogRef.close).toHaveBeenCalledWith(customer);
  });

  it('should handle form submission for updating a customer', () => {
    const customer: Customer = { id: 1, firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com' };
    component.customer = customer;
    component.formType = FormType.EDIT;

    mockCustomerService.update.and.returnValue(of(customer));
    spyOn(component, 'updateCustomer').and.callThrough();

    component.handleFormSubmission({ valid: true } as NgForm);

    expect(mockLoadingService.show).toHaveBeenCalled();
    expect(component.updateCustomer).toHaveBeenCalled();
    expect(mockCustomerService.update).toHaveBeenCalledWith(customer.id, customer);
    expect(mockDialogRef.close).toHaveBeenCalledWith(customer);
  });

  it('should handle create customer error', () => {
    const customer: Customer = { id: 0, firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com' };
    component.customer = customer;

    mockCustomerService.create.and.returnValue(throwError(() => new Error('Error')));
    spyOn(component, 'createCustomer').and.callThrough();

    component.handleFormSubmission({ valid: true } as NgForm);

    expect(mockLoadingService.show).toHaveBeenCalled();
    expect(component.createCustomer).toHaveBeenCalled();
  });

  it('should handle update customer error', () => {
    const customer: Customer = { id: 1, firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com' };
    component.customer = customer;
    component.formType = FormType.EDIT;

    mockCustomerService.update.and.returnValue(throwError(() => new Error('Error')));
    spyOn(component, 'updateCustomer').and.callThrough();

    component.handleFormSubmission({ valid: true } as NgForm);

    expect(mockLoadingService.show).toHaveBeenCalled();
    expect(component.updateCustomer).toHaveBeenCalled();
  });

  it('should call dialogRef.close() on cancel', () => {
    component.cancel();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
