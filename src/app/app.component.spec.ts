import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { ConfigService } from './services/config.service';
import { SettingsDialogComponent } from 'src/app/components/settings-dialog/settings-dialog.component';
import { AppConstants } from './app.constants';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { LoadingComponent } from './components/loading/loading.component';

class MockConfigService {
  baseUrl = '';
}

class MockMatDialog {
  open() {
    return {} as MatDialogRef<any>;
  }
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockConfigService: MockConfigService;
  let mockMatDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    mockConfigService = new MockConfigService();
    mockMatDialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatToolbarModule, MatIconModule],
      declarations: [AppComponent, LoadingComponent, SettingsDialogComponent],
      providers: [
        { provide: ConfigService, useValue: mockConfigService },
        { provide: MatDialog, useValue: mockMatDialog }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'customer-app'`, () => {
    expect(component.title).toEqual('customer-app');
  });

  it('should open settings dialog on openSettingsDialog call', () => {
    const dialogRef = {
      afterClosed: () => of(true)
    } as MatDialogRef<any>; 

    mockMatDialog.open.and.returnValue(dialogRef);

    component.openSettingsDialog();
    expect(mockMatDialog.open).toHaveBeenCalledWith(SettingsDialogComponent, {
      width: AppConstants.FORM_SETTING_WIDTH,
      maxWidth: AppConstants.FORM_SETTING_MAX_WIDTH,
    });
  });
});
