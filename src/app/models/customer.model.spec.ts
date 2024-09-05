import { Customer } from './customer.model';

describe('Customer', () => {
  it('should create an instance', () => {
    expect(new Customer()).toBeTruthy();
  });

  it('should allow setting properties', () => {
    const customer = new Customer();
    customer.id = 1;
    customer.firstName = 'John';
    customer.lastName = 'Doe';
    customer.email = 'john.doe@example.com';

    expect(customer.id).toBe(1);
    expect(customer.firstName).toBe('John');
    expect(customer.lastName).toBe('Doe');
    expect(customer.email).toBe('john.doe@example.com');
  });
});
