export class Customer {
    id!: number;
    firstName?: string;
    lastName?: string;
    email?: string;

    constructor(id?: number, firstName?: string, lastName?: string, email?: string) {
        this.id = id || -1;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }
    
    static fromData(data: any): Customer {
        if (data && data.Id) {
            console.log()
            if (data.Id !== undefined && data.Id !== null) {
                const id = typeof data.Id === 'string' ? Number(data.Id) : data.Id;
                return new Customer(id, data.FirstName, data.LastName, data.Email);
            } else {
                console.log("Invalid customer id", data);
                return new Customer();
            }
        } else {
            console.log("Invalid customer data", data);
            return new Customer();
        }
    }
}

export interface ApiResponse {
    message: string;
    data: string;
    statusCode: number;
}