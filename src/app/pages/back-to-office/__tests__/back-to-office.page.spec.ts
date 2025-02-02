import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavParams, Platform } from '@ionic/angular';
import { NavParamsMock, PlatformMock } from '@mocks/index.mock';
import { KeepAwake as Insomnia } from '@capacitor-community/keep-awake';
import { AppModule } from 'src/app/app.module';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { Store, StoreModule } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { DeviceProvider } from '@providers/device/device';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { MockComponent } from 'ng-mocks';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { JOURNAL_PAGE } from '@pages/page-names.constants';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { BasePageComponent } from '@shared/classes/base-page';
import { ScreenOrientation } from '@capawesome/capacitor-screen-orientation';
import { BackToOfficePage, NavigationTarget } from '../back-to-office.page';

describe('BackToOfficePage', () => {
  let fixture: ComponentFixture<BackToOfficePage>;
  let component: BackToOfficePage;
  let modalController: ModalController;
  let store$: Store<StoreModel>;
  let deviceProvider: DeviceProvider;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        BackToOfficePage,
        MockComponent(PracticeModeBanner),
      ],
      imports: [
        IonicModule,
        AppModule,
        StoreModule.forRoot({}),
      ],
      providers: [
        {
          provide: Platform,
          useClass: PlatformMock,
        },
        {
          provide: AuthenticationProvider,
          useClass: AuthenticationProviderMock,
        },
        {
          provide: RouteByCategoryProvider,
          useClass: RouteByCategoryProviderMock,
        },
        {
          provide: DeviceProvider,
          useClass: DeviceProviderMock,
        },
        {
          provide: ModalController,
          useClass: ModalControllerMock,
        },
        {
          provide: NavParams,
          useClass: NavParamsMock,
        },
        {
          provide: DateTimeProvider,
          useClass: DateTimeProviderMock,
        },
      ],
    });

    fixture = TestBed.createComponent(BackToOfficePage);
    component = fixture.componentInstance;
    deviceProvider = TestBed.inject(DeviceProvider);
    modalController = TestBed.inject(ModalController);
    store$ = TestBed.inject(Store);
    router = TestBed.inject(Router);
    spyOn(store$, 'dispatch');
    spyOn(router, 'navigate')
      .and
      .returnValue(Promise.resolve(true));
    spyOn(BasePageComponent.prototype, 'isIos')
      .and
      .returnValue(true);
  }));

  describe('Class', () => {
    describe('ionViewDidEnter', () => {
      it('should disable test inhibitions when in practice mode', async () => {
        spyOn(ScreenOrientation, 'unlock');
        spyOn(Insomnia, 'allowSleep');
        await component.ionViewDidEnter();
        expect(deviceProvider.disableSingleAppMode)
          .not
          .toHaveBeenCalled();
        expect(ScreenOrientation.unlock)
          .toHaveBeenCalled();
        expect(Insomnia.allowSleep)
          .toHaveBeenCalled();
      });
    });

    describe('navigateForward', () => {
      it('should display modal and call onContinue with office when singleAppModeEnabled is false', async () => {
        component.singleAppModeEnabled = false;
        spyOn(modalController, 'create')
          .and
          .returnValue(Promise.resolve({
            present: async () => {
            },
            onDidDismiss: () => {
            },
          } as HTMLIonModalElement));
        spyOn(component, 'onContinue');
        await component.navigateForward(NavigationTarget.OFFICE);
        expect(modalController.create)
          .toHaveBeenCalledTimes(1);
        expect(component.onContinue)
          .toHaveBeenCalledWith(NavigationTarget.OFFICE);
      });

      // eslint-disable-next-line max-len
      it('should NOT display modal, but still call onContinue with office when singleAppModeEnabled is true', async () => {
        component.singleAppModeEnabled = true;
        spyOn(modalController, 'create')
          .and
          .returnValue(Promise.resolve({
            present: async () => {
            },
            onDidDismiss: () => {
            },
          } as HTMLIonModalElement));
        spyOn(component, 'onContinue');
        await component.navigateForward(NavigationTarget.OFFICE);
        expect(modalController.create)
          .toHaveBeenCalledTimes(0);
        expect(component.onContinue)
          .toHaveBeenCalledWith(NavigationTarget.OFFICE);
      });
    });

    describe('onContinue', () => {
      it('should call goToOfficePage when office is passed in', () => {
        spyOn(component, 'goToOfficePage');
        component.onContinue(NavigationTarget.OFFICE);
        expect(component.goToOfficePage)
          .toHaveBeenCalled();
      });

      it('should call goToJournal when journal is passed in', () => {
        spyOn(component, 'goToJournal');
        component.onContinue(NavigationTarget.JOURNAL);
        expect(component.goToJournal)
          .toHaveBeenCalled();
      });
    });

    describe('goToJournal', () => {
      it('should call the popTo method in the navcontroller if not in practice mode', () => {
        component.goToJournal();
        expect(router.navigate)
          .toHaveBeenCalledWith([JOURNAL_PAGE], { replaceUrl: true });
      });
      it('should call the popTo method in the navcontroller if in practice mode', async () => {
        component.isEndToEndPracticeMode = true;
        spyOn(component, 'exitPracticeMode');
        await component.goToJournal();
        expect(component.exitPracticeMode)
          .toHaveBeenCalled();
      });
    });
  });

  describe('DOM', () => {
    it('should show the return to journal button when not a rekey', () => {
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.bottom-button')))
        .toBeDefined();
    });
    it('should hide the return to journal button when this is a rekey', () => {
      fixture.detectChanges();
      component.pageState.isRekey$ = of(true);
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.bottom-button')))
        .toBeNull();
    });
  });
});
