import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import {
  getEcoFaultText, getETAFaultText, hasDangerousFault, hasSeriousFault,
} from '../../common/test-data.selector';
import {
  areTellMeQuestionsCorrect,
  areTellMeQuestionsSelected,
  getDrivingFaultCount,
  getManoeuvresADI2,
  hasEyesightTestBeenCompleted,
  hasEyesightTestGotSeriousFault,
  hasManoeuvreBeenCompletedCatADIPart2,
  hasVehicleChecksBeenCompletedCatADI2,
} from '../test-data.cat-adi-part2.selector';
import { Competencies } from '../../test-data.constants';

describe('TestDataSelectors Cat ADI2', () => {
  const state: CatADI2UniqueTypes.TestData = {
    drivingFaults: {
      controlsGears: 1,
    },
    seriousFaults: {
      awarenessPlanning: true,
    },
    dangerousFaults: {
      useOfSpeed: true,
    },
    testRequirements: {
      normalStart1: true,
      normalStart2: true,
      downhillStart: true,
      uphillStart: true,
    },
    ETA: {
      physical: false,
      verbal: false,
    },
    eco: {
      adviceGivenControl: false,
      adviceGivenPlanning: false,
    },
    manoeuvres: [{
      reverseRight: {
        selected: true,
        controlFault: CompetencyOutcome.DF,
      },
    }, {}],
    vehicleChecks: {
      tellMeQuestions: [
        {
          code: '',
          outcome: CompetencyOutcome.DF,
        },
      ],
    },
    eyesightTest: {
      complete: true,
      seriousFault: false,
    },
  };

  describe('hasEyesightTestBeenCompleted', () => {
    it('should return true if the eyesight test is complete', () => {
      expect(hasEyesightTestBeenCompleted(state))
        .toBe(true);
    });

    it('should return false if the eyesight test is not complete', () => {
      const newState: CatADI2UniqueTypes.TestData = {
        ...state,
        eyesightTest: { complete: false },
      };
      expect(hasEyesightTestBeenCompleted(newState))
        .toBe(false);
    });
  });

  describe('hasEyesightTestGotSeriousFault', () => {
    it('should return true if the eyesight test has a serious fault', () => {
      const newState: CatADI2UniqueTypes.TestData = {
        ...state,
        eyesightTest: { seriousFault: true },
      };
      expect(hasEyesightTestGotSeriousFault(newState))
        .toBe(true);
    });

    it('should return false if the eyesight test does not have a serious fault', () => {
      expect(hasEyesightTestGotSeriousFault(state))
        .toBe(false);
    });
  });

  describe('getDrivingFaultCount', () => {
    it('should return the driving fault count', () => {
      expect(getDrivingFaultCount(state, Competencies.controlsGears))
        .toBe(1);
    });
    it('should return undefined when there hasnt been any driving faults', () => {
      expect(getDrivingFaultCount(state, Competencies.controlsParkingBrake))
        .toBeUndefined();
    });
  });

  describe('hasSeriousFault', () => {
    it('should return true if a competency has a serious fault', () => {
      expect(hasSeriousFault(state, Competencies.awarenessPlanning))
        .toEqual(true);
    });
    it('should return false if a competency does not have a serious fault', () => {
      expect(hasSeriousFault(state, Competencies.controlsClutch))
        .toBeFalsy();
    });
  });

  describe('hasDangerousFault', () => {
    it('should return true if a competency has a dangerous fault', () => {
      expect(hasDangerousFault(state, Competencies.useOfSpeed))
        .toEqual(true);
    });
    it('should return false if a competency does not have a dangerous fault', () => {
      expect(hasDangerousFault(state, Competencies.useOfMirrorsSignalling))
        .toBeFalsy();
    });
  });

  describe('getETAFaultText', () => {
    it('should return null if no ETA faults', () => {
      const result = getETAFaultText(state.ETA);
      expect(result)
        .toBeUndefined();
    });
    it('should return `Physical and Verbal` if both ETA faults', () => {
      const result = getETAFaultText({
        ...state.ETA,
        physical: true,
        verbal: true,
      });
      expect(result)
        .toEqual('Physical and Verbal');
    });
    it('should return `Physical` if just physical ETA fault', () => {
      const result = getETAFaultText({
        ...state.ETA,
        physical: true,
        verbal: false,
      });
      expect(result)
        .toEqual('Physical');
    });
    it('should return `Verbal` if just verbal ETA fault', () => {
      const result = getETAFaultText({
        ...state.ETA,
        physical: false,
        verbal: true,
      });
      expect(result)
        .toEqual('Verbal');
    });
  });

  describe('getEcoFaultText', () => {
    it('should return null if no eco faults', () => {
      const result = getEcoFaultText(state.eco);
      expect(result)
        .toBeUndefined();
    });
    it('should return `Control and Planning` if both eco faults', () => {
      const result = getEcoFaultText({
        ...state.eco,
        adviceGivenControl: true,
        adviceGivenPlanning: true,
      });
      expect(result)
        .toEqual('Control and Planning');
    });
    it('should return `Control` if just control eco fault', () => {
      const result = getEcoFaultText({
        ...state.eco,
        adviceGivenControl: true,
        adviceGivenPlanning: false,
      });
      expect(result)
        .toEqual('Control');
    });
    it('should return `Planning` if just planning eco fault', () => {
      const result = getEcoFaultText({
        ...state.eco,
        adviceGivenControl: false,
        adviceGivenPlanning: true,
      });
      expect(result)
        .toEqual('Planning');
    });
  });

  describe('getManoeuvres', () => {
    it('should retrieve the manoeuvres data when requested', () => {
      const result = getManoeuvresADI2(state);
      expect(result)
        .toEqual(state.manoeuvres);
    });
  });

  describe('hasManoeuvreBeenCompleted', () => {
    it('should return false when no manoeuvres have been completed', () => {
      const mockState: CatADI2UniqueTypes.Manoeuvres[] = [{}];
      expect(hasManoeuvreBeenCompletedCatADIPart2(mockState))
        .toEqual(false);
    });
    it('should return true when 2 manoeuvres have been completed', () => {
      const mockState: CatADI2UniqueTypes.Manoeuvres[] = [
        {
          reverseRight: {
            selected: true,
          },
        },
        {
          reverseParkRoad: {
            selected: true,
          },
        },
      ];
      expect(hasManoeuvreBeenCompletedCatADIPart2(mockState))
        .toEqual(true);
    });
    it('should return false with only 1 manoeuvre completed', () => {
      const mockState: CatADI2UniqueTypes.Manoeuvres[] = [
        {
          reverseRight: {
            selected: true,
          },
        },
      ];
      expect(hasManoeuvreBeenCompletedCatADIPart2(mockState))
        .toEqual(false);
    });
  });

  describe('vehicle checks selector', () => {
    describe('areTellMeQuestionsSelected', () => {
      it('should return true if there is a tell me question selected', () => {
        const mockState: CatADI2UniqueTypes.VehicleChecks = {
          tellMeQuestions: [
            {
              code: 'T1',
              description: 'desc',
              outcome: CompetencyOutcome.P,
            },
          ],
        };
        expect(areTellMeQuestionsSelected(mockState))
          .toBe(true);
      });
      it('should return false if there is no tell me question selected', () => {
        expect(areTellMeQuestionsSelected({}))
          .toBe(false);
      });
    });
    describe('areTellMeQuestionsCorrect', () => {
      const passedState: CatADI2UniqueTypes.VehicleChecks = {
        tellMeQuestions: [
          {
            code: 'T1',
            description: 'desc',
            outcome: CompetencyOutcome.P,
          },
        ],
      };

      it('should return true if the tell me question is marked as a pass', () => {
        expect(areTellMeQuestionsCorrect(passedState))
          .toBe(true);
      });
      it('should return false if the tell me question is marked as a driving fault', () => {
        const failedState: CatADI2UniqueTypes.VehicleChecks = {
          tellMeQuestions: [
            {
              code: 'T1',
              description: 'desc',
              outcome: CompetencyOutcome.D,
            },
          ],
        };
        expect(areTellMeQuestionsCorrect(failedState))
          .toBe(false);
      });
    });

    describe('hasVehicleChecksBeenCompleted', () => {
      it('should return true if vehicle checks have been completed with a pass & button has been selected', () => {
        const mockState: CatADI2UniqueTypes.VehicleChecks = {
          tellMeQuestions: [
            {
              outcome: CompetencyOutcome.P,
            },
            {
              outcome: CompetencyOutcome.P,
            },
            {
              outcome: CompetencyOutcome.P,
            },
          ],
          vehicleChecksCompleted: true,
        };

        expect(hasVehicleChecksBeenCompletedCatADI2(mockState))
          .toEqual(true);
      });
      it('should return true if vehicle checks have been completed with driving faults', () => {
        const mockState: CatADI2UniqueTypes.VehicleChecks = {
          tellMeQuestions: [
            {
              outcome: CompetencyOutcome.DF,
            },
            {
              outcome: CompetencyOutcome.DF,
            },
            {
              outcome: CompetencyOutcome.DF,
            },
          ],
          vehicleChecksCompleted: true,
        };

        expect(hasVehicleChecksBeenCompletedCatADI2(mockState))
          .toEqual(true);
      });
      it('should return true if vehicle checks have been completed with a serious fault', () => {
        const mockState: CatADI2UniqueTypes.VehicleChecks = {
          tellMeQuestions: [
            {
              outcome: CompetencyOutcome.S,
            },
            {
              outcome: CompetencyOutcome.S,
            },
            {
              outcome: CompetencyOutcome.S,
            },
          ],
          vehicleChecksCompleted: true,
        };

        expect(hasVehicleChecksBeenCompletedCatADI2(mockState))
          .toEqual(true);
      });
      it('should return true if vehicle checks have been completed with a dangerous fault', () => {
        const mockState: CatADI2UniqueTypes.VehicleChecks = {
          tellMeQuestions: [
            {
              outcome: CompetencyOutcome.D,
            },
            {
              outcome: CompetencyOutcome.D,
            },
            {
              outcome: CompetencyOutcome.D,
            },
          ],
          vehicleChecksCompleted: true,
        };

        expect(hasVehicleChecksBeenCompletedCatADI2(mockState))
          .toEqual(true);
      });
      it('should return false if vehicleChecksCompleted is false', () => {
        const mockState: CatADI2UniqueTypes.VehicleChecks = {

          tellMeQuestions: [
            {
              outcome: CompetencyOutcome.P,
            },
            {
              outcome: CompetencyOutcome.P,
            },
            {
              outcome: CompetencyOutcome.P,
            },
          ],
          vehicleChecksCompleted: false,
        };

        expect(hasVehicleChecksBeenCompletedCatADI2(mockState))
          .toEqual(false);
      });
      it('should return false with an empty array as its parameter', () => {
        const mockState: CatADI2UniqueTypes.VehicleChecks = {
          tellMeQuestions: [],
          vehicleChecksCompleted: true,
        };

        expect(hasVehicleChecksBeenCompletedCatADI2(mockState))
          .toEqual(false);
      });
      it('should return false with an array under 2 items', () => {
        const mockState: CatADI2UniqueTypes.VehicleChecks = {
          tellMeQuestions: [
            {
              outcome: CompetencyOutcome.P,
            },
          ],
          vehicleChecksCompleted: true,
        };

        expect(hasVehicleChecksBeenCompletedCatADI2(mockState))
          .toEqual(false);
      });
    });
  });
});
