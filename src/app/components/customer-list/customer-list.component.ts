import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Customer } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/services/customer.service';
import { debounceTime, finalize } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConstants, FormType } from 'src/app/app.constants';
import { LoadingService } from 'src/app/services/loading.service';
import { SelectionModel } from '@angular/cdk/collections';
import { CustomerFormDialogComponent } from 'src/app/components/customer-form-dialog/customer-form-dialog.component';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit, AfterViewInit {
  searchControl = new FormControl('');
  displayedColumns = AppConstants.TABLE_CUSTOMER_HEADERS;
  tableLabels = AppConstants.TABLE_CUSTOMER_HEADER_FULLNAME;
  dataSource = new MatTableDataSource<Customer>([]);
  pageSize = AppConstants.DEFAULT_PAGE_SIZE;
  pageSizeOptions = AppConstants.PAGE_SIZE_OPTIONS;

  selection = new SelectionModel<Customer>(false, []); // Single selection
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private customerService: CustomerService,
    private _snackBar: MatSnackBar,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(AppConstants.SEARCH_DEBOUNCE_TIME)
    ).subscribe(searchTerm => this.searchCustomer(searchTerm));

    this.searchCustomer('');
    this.loadSelectedCustomer();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  private loadSelectedCustomer(): void {
    const lastSelectedCustomerId = Number(sessionStorage.getItem('lastSelectedCustomerId'));
    if (lastSelectedCustomerId) {
      const customer = this.dataSource.data.find(c => c.id === lastSelectedCustomerId);
      if (customer) {
        this.selection.select(customer);
      }
    }
  }

  onSelectCustomer(customer: Customer): void {
    sessionStorage.setItem('lastSelectedCustomerId', customer.id.toString());
    this.selection.select(customer);
  }
  
  isRowSelected(row: Customer): boolean {
    return this.selection.isSelected(row);
  }

  private searchCustomer(searchTerm: string | null): void {
    this.loadingService.show();
    this.customerService.getCustomers(searchTerm).pipe(
      finalize(() => this.loadingService.hide())
    ).subscribe(data => {
      this.dataSource.data = data;
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  addCustomer(): void {
    const dialogRef = this.dialog.open(CustomerFormDialogComponent, {
      width: '400px',
      data: { formType: FormType.CREATE, customer: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.searchCustomer(this.searchControl.value);
      }
    });
  }

  editCustomer(customer: Customer, event: Event): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(CustomerFormDialogComponent, {
      width: '400px',
      data: { formType: FormType.EDIT, customer }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.searchCustomer(this.searchControl.value);
      }
    });
  }

  deleteCustomer(id: number): void {
    if (window.confirm(AppConstants.ALERT_DELETE_MESSAGE)) {
      this.performDelete(() => this.customerService.delete(id), AppConstants.SNACKBAR_DELETE_SUCCESS_MESSAGE, AppConstants.SNACKBAR_DELETE_FAILED_MESSAGE);
    }
  }

  removeAllCustomers(): void {
    if (window.confirm(AppConstants.ALERT_DELETE_ALL_MESSAGE)) {
      this.performDelete(() => this.customerService.deleteAll(), AppConstants.SNACKBAR_DELETE_ALL_SUCCESS_MESSAGE, AppConstants.SNACKBAR_DELETE_ALL_FAILED_MESSAGE);
    }
  }

  private performDelete(deleteFn: () => any, successMessage: string, errorMessage: string): void {
    this.loadingService.show();
    deleteFn().pipe(
      finalize(() => this.loadingService.hide())
    ).subscribe({
      next: () => {
        this._snackBar.open(successMessage, '', {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: AppConstants.SNACKBAR_DURATION
        });
        this.searchCustomer(this.searchControl.value);
      },
      error: (e: any) => {
        console.error(e);
        this._snackBar.open(errorMessage, '', {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: AppConstants.SNACKBAR_DURATION
        });
      }
    });
  }
}
