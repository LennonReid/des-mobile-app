import { Component, OnInit } from '@angular/core';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import { Platform } from '@ionic/angular';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { TrueLikenessToPhotoChanged } from '@store/tests/test-summary/test-summary.actions';
import { FormGroup } from '@angular/forms';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getJournalData } from '@store/tests/tests.selector';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import {
  getCandidateDriverNumber,
  getDateOfBirth,
  getGender,
  getGenderFullDescription,
  getGenderSilhouettePath,
  getUntitledCandidateName,
} from '@store/tests/journal-data/common/candidate/candidate.selector';
import {
  catchError,
  filter,
  map, switchMap, take, tap, withLatestFrom,
} from 'rxjs/operators';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { getTestSummary } from '@store/tests/test-summary/test-summary.reducer';
import { getTrueLikenessToPhoto } from '@store/tests/test-summary/test-summary.selector';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { CandidateLicenceProvider, CandidateLicenceErr } from '@providers/candidate-licence/candidate-licence';
import {
  getApplicationReference,
} from '@store/tests/journal-data/common/application-reference/application-reference.reducer';
import {
  getApplicationNumber,
} from '@store/tests/journal-data/common/application-reference/application-reference.selector';
import { DriverLicenceSchema, DriverPhotograph } from '@dvsa/mes-driver-schema';
import {
  CandidateLicenceDataValidationError,
  CandidateLicenceViewDidEnter,
} from '@pages/candidate-licence/candidate-licence.actions';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { getRekeyIndicator } from '@store/tests/rekey/rekey.reducer';
import { isRekey } from '@store/tests/rekey/rekey.selector';

interface CandidateLicencePageState {
  candidateUntitledName$: Observable<string>;
  candidateDriverNumber$: Observable<string>;
  testCategory$: Observable<CategoryCode>;
  trueLikenessToPhoto$: Observable<boolean>;
  driverPhotograph$: Observable<string>;
  genderDescription$: Observable<string>;
  age$: Observable<number>;
  candidateData$: Observable<DriverLicenceSchema>;
}

@Component({
  selector: 'app-candidate-licence',
  templateUrl: './candidate-licence.page.html',
  styleUrls: ['./candidate-licence.page.scss'],
})
export class CandidateLicencePage extends PracticeableBasePageComponent implements OnInit {

  formGroup: FormGroup;
  pageState: CandidateLicencePageState;
  driverDataReturned: boolean = false;
  candidateDataError: boolean = false;
  candidateDataUnavailable: boolean = false;
  niLicenceDetected: boolean = false;
  offlineError: boolean = false;

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    private networkStateProvider: NetworkStateProvider,
    private candidateLicenceProvider: CandidateLicenceProvider,
    private domSanitizer: DomSanitizer,
  ) {
    super(platform, authenticationProvider, router, store$, false);
    this.formGroup = new FormGroup({});
  }

  ngOnInit() {
    super.ngOnInit();

    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.pageState = {
      candidateUntitledName$: currentTest$.pipe(
        select(getJournalData),
        select(getCandidate),
        select(getUntitledCandidateName),
      ),
      candidateDriverNumber$: currentTest$.pipe(
        select(getJournalData),
        select(getCandidate),
        select(getCandidateDriverNumber),
      ),
      testCategory$: currentTest$.pipe(
        select(getTestCategory),
      ),
      trueLikenessToPhoto$: currentTest$.pipe(
        select(getTestSummary),
        select(getTrueLikenessToPhoto),
      ),
      driverPhotograph$: currentTest$.pipe(
        select(getJournalData),
        select(getCandidate),
        select(getGender),
        map(getGenderSilhouettePath),
        take(1),
      ),
      genderDescription$: currentTest$.pipe(
        select(getJournalData),
        select(getCandidate),
        select(getGender),
        map(getGenderFullDescription),
      ),
      age$: currentTest$.pipe(
        select(getJournalData),
        select(getCandidate),
        select(getDateOfBirth),
        map((dateOfBirth: string) => moment().diff(dateOfBirth, 'years')),
      ),
      candidateData$: currentTest$.pipe(
        select(getJournalData),
        select(getCandidate),
        select(getCandidateDriverNumber),
        withLatestFrom(
          currentTest$.pipe(
            select(getJournalData),
            select(getApplicationReference),
            select(getApplicationNumber),
          ),
          currentTest$.pipe(
            select(getRekeyIndicator),
            select(isRekey),
          ),
        ),
        filter(([, , isRekeyTest]) => !this.isPracticeMode && !isRekeyTest),
        switchMap((
          [driverNumber, appRef],
        ) => this.candidateLicenceProvider.getCandidateData(driverNumber, appRef)),
        catchError((err) => {
          if (err instanceof Error) {
            this.setError(err);
          } else {
            this.candidateDataError = true;
          }
          this.driverDataReturned = false;
          return of(null);
        }),
        tap(() => this.driverDataReturned = true),
      ),
    };
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(CandidateLicenceViewDidEnter());
  }

  trueLikenessToPhotoChanged(trueLikeness: boolean): void {
    this.store$.dispatch(TrueLikenessToPhotoChanged(trueLikeness));
  }

  getImage = (img: string = null, driverPhotograph: DriverPhotograph): SafeUrl => {
    // practice mode will use silhouettes;
    if (img && this.isPracticeMode) {
      return img;
    }
    // means not in practice mode, but data not yet returned from EP or no data exists;
    if (!img || !this.driverDataReturned || !driverPhotograph) {
      return null;
    }
    const { image, imageFormat } = driverPhotograph?.photograph;
    return this.domSanitizer.bypassSecurityTrustUrl(`data:${imageFormat};base64,${image}`);
  };

  onContinue = async (): Promise<void> => {
    Object.keys(this.formGroup.controls)
      .forEach((controlName) => this.formGroup.controls[controlName].markAsDirty());

    if (this.formGroup.valid) {
      await this.router.navigate([TestFlowPageNames.COMMUNICATION_PAGE]);
      return;
    }

    Object.keys(this.formGroup.controls).forEach((controlName) => {
      if (this.formGroup.controls[controlName].invalid) {
        this.store$.dispatch(CandidateLicenceDataValidationError(`${controlName} is blank`));
      }
    });
  };

  get hasErrored(): boolean {
    return (
      this.offlineError
        || this.candidateDataError
        || this.candidateDataUnavailable
        || this.niLicenceDetected
    );
  }

  private setError(err: Error): void {
    switch (err.message) {
      case CandidateLicenceErr.OFFLINE:
        this.offlineError = true;
        break;
      case CandidateLicenceErr.UNAVAILABLE:
        this.candidateDataUnavailable = true;
        break;
      case CandidateLicenceErr.NI_LICENCE:
        this.niLicenceDetected = true;
        break;
      default:
        this.candidateDataError = true;
    }
  }

}
