import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { Customer } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/services/customer.service';
import { AppConstants, FormType } from 'src/app/app.constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingService } from 'src/app/services/loading.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-customer-form-dialog',
  templateUrl: './customer-form-dialog.component.html',
  styleUrls: ['./customer-form-dialog.component.css']
})
export class CustomerFormDialogComponent implements OnInit {
  formType: FormType;
  customer: Customer;
  title: string;
  formLabels: string[];
  submitButtonLabel: string;

  constructor(
    public dialogRef: MatDialogRef<CustomerFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { formType: FormType, customer?: Customer },
    private customerService: CustomerService,
    private snackBar: MatSnackBar,
    private loadingService: LoadingService
  ) {
    this.formType = data.formType;
    this.customer = data.customer ? { ...data.customer } : this.initializeNewCustomer();
    this.title = this.formType === FormType.CREATE ? AppConstants.FORM_CREATE_TITLE : AppConstants.FORM_EDIT_FORM_TITLE;
    this.formLabels = AppConstants.TABLE_CUSTOMER_HEADER_FULLNAME;
    this.submitButtonLabel = this.formType === FormType.CREATE ? AppConstants.FORM_BUTTON_LABEL[0] : AppConstants.FORM_BUTTON_LABEL[1];
  }

  ngOnInit(): void {
    if (this.formType === FormType.EDIT) {
      this.loadCustomer();
    }
  }

  private initializeNewCustomer(): Customer {
    return { id: 0, firstName: '', lastName: '', email: '' };
  }

  private loadCustomer(): void {
    this.customerService.get(this.customer.id).subscribe({
      next: data => this.customer = data,
      error: err => this.handleError(err, AppConstants.SNACKBAR_LOAD_FAILED_MESSAGE)
    });
  }

  handleFormSubmission(form: NgForm): void {
    if (form.valid) {
      this.loadingService.show();
      this.formType === FormType.EDIT ? this.updateCustomer() : this.createCustomer();
    }
  }

  public createCustomer(): void {  // Changed to public
    this.customerService.create(this.customer).pipe(
      finalize(() => this.loadingService.hide())
    ).subscribe({
      next: (res) => this.handleSuccess(res, AppConstants.SNACKBAR_CREATE_SUCCESS_MESSAGE),
      error: (e) => this.handleError(e, AppConstants.SNACKBAR_CREATE_FAILED_MESSAGE)
    });
  }

  public updateCustomer(): void {  // Changed to public
    this.customerService.update(this.customer.id, this.customer).pipe(
      finalize(() => this.loadingService.hide())
    ).subscribe({
      next: (res) => this.handleSuccess(res, AppConstants.SNACKBAR_EDIT_SUCCESS_MESSAGE),
      error: (e) => this.handleError(e, AppConstants.SNACKBAR_EDIT_FAILED_MESSAGE)
    });
  }

  private handleSuccess(response: any, successMessage: string): void {
    console.log('Operation success:', response);
    this.snackBar.open(`${successMessage} ID: ${response}`, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: AppConstants.SNACKBAR_DURATION
    });
    this.dialogRef.close(this.customer);
  }

  private handleError(error: any, errorMessage: string): void {
    console.error('Operation failed:', error);
    this.snackBar.open(errorMessage, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: AppConstants.SNACKBAR_DURATION
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
