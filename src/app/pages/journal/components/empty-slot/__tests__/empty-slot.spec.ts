import { MockComponent } from 'ng-mocks';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { cloneDeep } from 'lodash';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { TimeComponent } from '@components/test-slot/time/time';
import { LocationComponent } from '@components/test-slot/location/location';
import { EmptySlotComponent } from '../empty-slot';

describe('EmptySlotComponent', () => {
  let fixture: ComponentFixture<EmptySlotComponent>;
  let component: EmptySlotComponent;
  const mockSlot = {
    slotDetail: {
      slotId: 1001,
      start: '2018-12-10T09:07:00+00:00',
      duration: 57,
    },
    vehicleSlotType: 'B57mins',
    testCentre: {
      centreId: 54321,
      centreName: 'Example Test Centre',
      costCode: 'EXTC1',
    },
    booking: {
      candidate: {
        candidateId: 101,
        age: 17,
        candidateName: {
          title: 'Miss',
          firstName: 'Florence',
          lastName: 'Pearson',
        },
        driverNumber: 'PEARS015220A99HC',
        gender: 'F',
        candidateAddress: {
          addressLine1: '1 Station Street',
          addressLine2: 'Someplace',
          addressLine3: 'Sometown',
          addressLine4: '',
          addressLine5: '',
          postcode: 'AB12 3CD',
        },
        primaryTelephone: '01234 567890',
        secondaryTelephone: '04321 098765',
        mobileTelephone: '07654 123456',
      },
      application: {
        applicationId: 1234567,
        bookingSequence: 3,
        checkDigit: 1,
        welshTest: false,
        extendedTest: false,
        meetingPlace: '',
        progressiveAccess: false,
        specialNeeds: 'Candidate has dyslexia',
        entitlementCheck: false,
        vehicleSeats: 5,
        vehicleHeight: 4,
        vehicleWidth: 3,
        vehicleLength: 2,
        testCategory: 'B',
        vehicleGearbox: 'Manual',
      },
      previousCancellation: [
        'Act of nature',
      ],
    },
  } as TestSlot;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        EmptySlotComponent,
        MockComponent(TimeComponent),
        MockComponent(LocationComponent),
      ],
      imports: [IonicModule],
    });

    fixture = TestBed.createComponent(EmptySlotComponent);
    component = fixture.componentInstance;
    component.slot = cloneDeep(mockSlot);
  }));

  describe('DOM', () => {
    describe('Component Interaction', () => {
      it('should pass something to sub-component time input', () => {
        fixture.detectChanges();
        const subByDirective = fixture.debugElement.query(By.directive(MockComponent(TimeComponent))).componentInstance;
        expect(subByDirective.time)
          .toBe('2018-12-10T09:07:00+00:00');
      });
      it('should pass something to sub-component location input', () => {
        component.showLocation = true;
        fixture.detectChanges();
        const subByDirective = fixture.debugElement
          .query(By.directive(MockComponent(LocationComponent))).componentInstance;
        expect(subByDirective.location)
          .toBe('Example Test Centre');
      });
    });
  });
});
