import { Component, Input } from '@angular/core';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { get } from 'lodash';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { CatCEUniqueTypes } from '@dvsa/mes-test-schema/categories/CE';
import { CatC1UniqueTypes } from '@dvsa/mes-test-schema/categories/C1';
import { CatC1EUniqueTypes } from '@dvsa/mes-test-schema/categories/C1E';
import * as CatAMod1Types from '@dvsa/mes-test-schema/categories/AM1';
import * as CatADI3Types from '@dvsa/mes-test-schema/categories/ADI3';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { flattenArray } from '@pages/view-test-result/view-test-result-helpers';
import { isAnyOf } from '@shared/helpers/simplifiers';
@Component({
  selector: 'vehicle-details-card',
  templateUrl: 'vehicle-details-card.html',
  styleUrls: ['vehicle-details-card.scss'],
})
export class VehicleDetailsCardComponent {

  @Input()
  data: CatBUniqueTypes.VehicleDetails
  | CatCUniqueTypes.VehicleDetails
  | CatCEUniqueTypes.VehicleDetails
  | CatC1UniqueTypes.VehicleDetails
  | CatC1EUniqueTypes.VehicleDetails
  | CatADI2UniqueTypes.VehicleDetails
  | CatADI3Types.VehicleDetails
  | CatAMod1Types.VehicleDetails;

  @Input()
  category: TestCategory | CategoryCode;

  @Input()
  passCompletion?: CatCUniqueTypes.PassCompletion = null;

  @Input()
  trainerData: CatADI2UniqueTypes.TrainerDetails;

  @Input()
  vehicleDetails: string[];

  @Input()
  instructorDetails: CatBUniqueTypes.InstructorDetails = null;

  public shouldHideCard() : boolean {
    return (!this.transmission && !this.registrationNumber && !this.schoolBike && !this.instructorRegistrationNumber);
  }

  public get shouldShowDimensions() : boolean {
    switch (this.category) {
      case TestCategory.BE:
      case TestCategory.C:
      case TestCategory.C1:
      case TestCategory.CE:
      case TestCategory.C1E:
      case TestCategory.CM:
      case TestCategory.C1M:
      case TestCategory.CEM:
      case TestCategory.C1EM:
      case TestCategory.D:
      case TestCategory.D1:
      case TestCategory.DE:
      case TestCategory.D1E:
      case TestCategory.DM:
      case TestCategory.D1M:
      case TestCategory.DEM:
      case TestCategory.D1EM:
        return true;
      default:
        return false;
    }
  }

  public get shouldShowExtraDimensions() : boolean {
    switch (this.category) {
      case TestCategory.CM:
      case TestCategory.C1M:
      case TestCategory.CEM:
      case TestCategory.C1EM:
      case TestCategory.DM:
      case TestCategory.D1M:
      case TestCategory.DEM:
      case TestCategory.D1EM:
        return true;
      default:
        return false;
    }
  }

  public get showTransmissionWithCode78() : boolean {
    switch (this.category) {
      case TestCategory.BE:
      case TestCategory.C:
      case TestCategory.C1:
      case TestCategory.CE:
      case TestCategory.C1E:
      case TestCategory.D:
      case TestCategory.D1:
      case TestCategory.DE:
      case TestCategory.D1E:
      case TestCategory.F:
      case TestCategory.G:
      case TestCategory.H:
      case TestCategory.K:
        return true;
      default:
        return false;
    }
  }

  public isADI2 = (): boolean => this.category === TestCategory.ADI2;

  public isADI3 = (): boolean => this.category === TestCategory.ADI3;

  public isBike = (): boolean => isAnyOf(this.category, [
    // Cat Mod1
    TestCategory.EUA1M1, TestCategory.EUA2M1, TestCategory.EUAM1, TestCategory.EUAMM1,
    // Cat Mod2
    TestCategory.EUA1M2, TestCategory.EUA2M2, TestCategory.EUAM2, TestCategory.EUAMM2,
  ]);

  public get instructorRegistrationNumber(): number {
    return get(this.instructorDetails, 'registrationNumber');
  }

  public get transmission(): string {
    return get(this.data, 'gearboxCategory');
  }

  public get registrationNumber(): string {
    return get(this.data, 'registrationNumber');
  }

  public get vehicleLength(): string {
    return get(this.data, 'vehicleLength', '?').toString();
  }

  public get vehicleWidth(): string {
    return get(this.data, 'vehicleWidth', '?').toString();
  }

  public get vehicleHeight(): string {
    return get(this.data, 'vehicleHeight', '?').toString();
  }

  public get numberOfSeats(): string {
    return get(this.data, 'numberOfSeats', '?').toString();
  }

  public get schoolBike(): string {
    if (!this.isBike()) {
      return null;
    }
    return get(this.data, 'schoolBike') ? 'Yes' : 'No';
  }

  public get trainerPRN(): number {
    return get(this.trainerData, 'trainerRegistrationNumber', null);
  }

  public get ordit(): string {
    return get(this.trainerData, 'orditTrainedCandidate', false) ? 'Yes' : 'No';
  }

  public get trainingRecords(): string {
    return get(this.trainerData, 'trainingRecords', false) ? 'Yes' : 'No';
  }

  public get displayVehicleDetails(): boolean {
    return get(this.data, 'schoolCar', false) || get(this.data, 'dualControls', false);
  }

  public get schoolCarDualControls(): string {
    return get(this.data, 'schoolCar') ? 'School Car' : 'Dual Controls';
  }
  public get dualControls(): string {
    return get(this.data, 'schoolCar') ? 'No' : 'Yes';
  }

  getFlattenArray = (data: string[]): string => flattenArray(data);

  displayRegistration() {
    return this.isADI3() || !this.instructorRegistrationNumber === undefined
        || this.shouldShowDimensions || !this.vehicleDetails === undefined;
  }
}
