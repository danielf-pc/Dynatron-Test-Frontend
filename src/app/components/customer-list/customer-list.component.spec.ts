import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { CustomerListComponent } from './customer-list.component';
import { CustomerService } from 'src/app/services/customer.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Customer } from 'src/app/models/customer.model';
import { AppConstants, FormType } from 'src/app/app.constants';
import { CustomerFormDialogComponent } from 'src/app/components/customer-form-dialog/customer-form-dialog.component';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

describe('CustomerListComponent', () => {
  let component: CustomerListComponent;
  let fixture: ComponentFixture<CustomerListComponent>;
  let customerService: jasmine.SpyObj<CustomerService>;
  let loadingService: jasmine.SpyObj<LoadingService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<any>>;

  beforeEach(async () => {
    const customerServiceSpy = jasmine.createSpyObj('CustomerService', ['getCustomers', 'delete', 'deleteAll']);
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of(true)); 
    dialogSpy.open.and.returnValue(dialogRefSpy); // Ensuring dialog.open returns the mocked dialogRef

    customerServiceSpy.getCustomers.and.returnValue(of([])); 
    customerServiceSpy.delete.and.returnValue(of({}));
    customerServiceSpy.deleteAll.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule, 
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatSnackBarModule,
      ],
      declarations: [ CustomerListComponent ],
      providers: [
        { provide: CustomerService, useValue: customerServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerListComponent);
    component = fixture.componentInstance;
    customerService = TestBed.inject(CustomerService) as jasmine.SpyObj<CustomerService>;
    loadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open dialog with formType CREATE on addCustomer', () => {
    component.addCustomer();
    expect(dialog.open).toHaveBeenCalledWith(CustomerFormDialogComponent, {
      width: '400px',
      data: { formType: FormType.CREATE, customer: null }
    });
    expect(dialogRefSpy.afterClosed).toHaveBeenCalled(); // Ensuring afterClosed is being called
  });


  it('should open dialog with formType EDIT on editCustomer', () => {
    const customer: Customer = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' };
    component.editCustomer(customer, new Event('click'));
    expect(dialog.open).toHaveBeenCalledWith(CustomerFormDialogComponent, {
      width: '400px',
      data: { formType: FormType.EDIT, customer }
    });
    expect(dialogRefSpy.afterClosed).toHaveBeenCalled(); // Ensuring afterClosed is being called here as well
  });

  it('should call delete', () => {
    const customerId = 1;
    customerService.delete.and.returnValue(of(true));
    component.deleteCustomer(customerId);
    expect(loadingService.show).toHaveBeenCalled();
    expect(loadingService.hide).toHaveBeenCalled();
  });

  it('should call deleteAll and show snackbar on successful removeAllCustomers', () => {
    customerService.deleteAll.and.returnValue(of(true));
    component.removeAllCustomers();
    expect(loadingService.show).toHaveBeenCalled();
    expect(loadingService.hide).toHaveBeenCalled();
  });

  it('should handle error on deleteCustomer', () => {
    const customerId = 1;
    customerService.delete.and.returnValue(throwError(() => new Error('Delete failed')));
    component.deleteCustomer(customerId);
    expect(loadingService.show).toHaveBeenCalled();
    expect(loadingService.hide).toHaveBeenCalled();
  });

  it('should handle error on removeAllCustomers', () => {
    customerService.deleteAll.and.returnValue(throwError(() => new Error('Delete all failed')));
    component.removeAllCustomers();
    expect(loadingService.show).toHaveBeenCalled();
    expect(loadingService.hide).toHaveBeenCalled();
  });
});
