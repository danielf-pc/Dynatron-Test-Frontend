import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Customer } from 'src/app/models/customer.model';
import { ConfigService } from './config.service';
import { ApiResponse } from 'src/app/models/customer.model'

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient, private configService: ConfigService) { }

  private get baseUrl(): string {
    return this.configService.baseUrl;
  }

  private handleResponse<T>(response: ApiResponse): T | null {
    if (response.message === 'success') {
      try {
        return JSON.parse(response.data);
      } catch (error) {
        console.error('Failed to parse response data:', error);
        return null;
      }
    } else {
      console.error('Request failed:', response.statusCode, response.message);
      return null;
    }
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error);
  }

  getCustomers(searchString: string | null): Observable<Customer[]> {
    let params = new HttpParams();
    if (searchString) {
      params = params.append('searchString', searchString);
    }

    return this.http.get<ApiResponse>(this.baseUrl, { params }).pipe(
      map(response => {
        const dataArray = this.handleResponse<any[]>(response);
        return dataArray ? dataArray.map(item => item.Id ? Customer.fromData(item) : new Customer())
        .filter(customer => customer.id !== -1) : [];
      }),
      catchError(this.handleError)
    );
  }

  get(id: any): Observable<any> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/${id}`).pipe(
      map(response => {
        const parsedData = this.handleResponse<Customer>(response);
        return parsedData ? Customer.fromData(parsedData) : null;
      }),
      catchError(this.handleError)
    );
  }

  create(data: any): Observable<number> {
    return this.http.post<ApiResponse>(this.baseUrl, data).pipe(
      map(response => {
        const parsedData = this.handleResponse<number>(response);
        return parsedData !== null ? parsedData : -1;
      }),
      catchError(this.handleError)
    );
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put<ApiResponse>(`${this.baseUrl}/${id}`, data).pipe(
      map(response => {
        const parsedData = this.handleResponse<Customer>(response);
        return parsedData ? Customer.fromData(parsedData) : null;
      }),
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${id}`).pipe(
      map(response => {
        if (response.message == "success")
          return true;
        return false;
      }),
      catchError(this.handleError)
    );
  }

  deleteAll(): Observable<boolean> {
    return this.http.delete<ApiResponse>(this.baseUrl).pipe(
      map(response => {
        const dataArray = this.handleResponse<any[]>(response);
        if (response.message == "success")
          return true;
        return false;
      }),
      catchError(this.handleError)
    );
  }
}
