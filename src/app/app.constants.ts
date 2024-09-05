export enum FormType {
    CREATE = 'Create',
    EDIT = 'Edit',
}

export class AppConstants {
    static readonly APP_NAME = "CUSTOMER SITE";
    
    static readonly FORM_CREATE_TITLE = "Create Customer";
    static readonly FORM_EDIT_FORM_TITLE = "Edit Customer";

    static readonly FORM_BUTTON_LABEL: string[] = ['Create', 'Update'];

    static readonly TABLE_CUSTOMER_HEADERS: string[] = ['id', 'firstName', 'lastName', 'email', 'actions'];
    static readonly TABLE_CUSTOMER_HEADER_FULLNAME: string[] = ['ID', 'First Name', 'Last Name', 'Email', 'Actions'];

    static readonly ALERT_DELETE_ALL_MESSAGE = "Do you want to delete all customers?\nif you delete once, you'll never recover again!";
    static readonly ALERT_DELETE_MESSAGE = "Do you want to delete this customer?";

    static readonly SNACKBAR_CREATE_SUCCESS_MESSAGE = "Customer Creation Successful!";
    static readonly SNACKBAR_CREATE_FAILED_MESSAGE = "Customer Creation Failed!";
    static readonly SNACKBAR_EDIT_SUCCESS_MESSAGE = "Customer Edit Successful!";
    static readonly SNACKBAR_EDIT_FAILED_MESSAGE = "Customer Edit Failed!";
    static readonly SNACKBAR_DELETE_SUCCESS_MESSAGE = "Customer Deletion Successful!";
    static readonly SNACKBAR_DELETE_FAILED_MESSAGE = "Customer Deletion Failed!";
    static readonly SNACKBAR_DELETE_ALL_SUCCESS_MESSAGE = "All Customer Deletions Successful!";
    static readonly SNACKBAR_DELETE_ALL_FAILED_MESSAGE = "All Customer Deletions Failed!";
    static readonly SNACKBAR_LOAD_SUCCESS_MESSAGE = "Customer Load Successful!";
    static readonly SNACKBAR_LOAD_FAILED_MESSAGE = "Customer Load Failed!";

    static readonly SNACKBAR_DURATION = 3000;

    static readonly FORM_SETTING_WIDTH = '60vw';
    static readonly FORM_SETTING_MAX_WIDTH = '600px';
    static readonly DEFAULT_PAGE_SIZE = 10;
    static readonly PAGE_SIZE_OPTIONS = [5, 10, 25, 100];
    static readonly SEARCH_DEBOUNCE_TIME = 300;
}
