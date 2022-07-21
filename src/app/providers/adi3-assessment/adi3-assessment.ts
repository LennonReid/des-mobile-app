import { Injectable } from '@angular/core';
import {
  LessonPlanning,
  RiskManagement,
  TeachingLearningStrategies,
  TestData,
} from '@dvsa/mes-test-schema/categories/ADI3';
import { get } from 'lodash';

@Injectable()
export class ADI3AssessmentProvider {

  private testDataKeys: Array<keyof TestData> = ['lessonPlanning', 'riskManagement', 'teachingLearningStrategies'];

  getTotalAssessmentScore = (testData: TestData): number => {
    return Object.keys(testData).reduce((sum: number, key: keyof TestData): number => {
      if (this.testDataKeys.includes(key) && typeof testData[key] === 'object') {
        return sum + (get(testData[key], 'score') || 0);
      }
      return sum;
    }, 0);
  };

  validateTestReport(
    lessonPlanning: LessonPlanning,
    riskManagement: RiskManagement,
    teachingLearningStrategies: TeachingLearningStrategies,
  ): number {
    return (
      this.countCompletedQuestions(lessonPlanning)
      + this.countCompletedQuestions(riskManagement)
      + this.countCompletedQuestions(teachingLearningStrategies));
  }

  countCompletedQuestions(data: LessonPlanning | RiskManagement | TeachingLearningStrategies): number {
    return Object.keys(data).filter((key) => {
      if (key.indexOf('score') > -1) {
        return false;
      }
      return data[key].score !== null;
    }).length;
  }

}