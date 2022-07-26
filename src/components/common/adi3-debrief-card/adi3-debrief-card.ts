import { Component, Input, OnInit } from '@angular/core';
import {
  LessonAndTheme,
  LessonPlanning, Review,
  RiskManagement,
  TeachingLearningStrategies,
} from '@dvsa/mes-test-schema/categories/ADI3';
import { lessonThemeValues, studentValues } from '@app/shared/constants/adi3-questions/lesson-theme.constants';
import { ActivityCode } from '@dvsa/mes-test-schema/categories/common';

@Component({
  selector: 'adi3-debrief-card',
  templateUrl: 'adi3-debrief-card.html',
  styleUrls: ['adi3-debrief-card.scss'],
})
export class Adi3DebriefCard implements OnInit {
  @Input()
  public totalScore: number;

  @Input()
  public lessonTheme: LessonAndTheme;

  @Input()
  public lessonPlanning: LessonPlanning;

  @Input()
  public riskManagement: RiskManagement;

  @Input()
  public teachingLearningStrategies: TeachingLearningStrategies;

  @Input()
  public testOutcome: { activityCode: ActivityCode, grade?: string };

  @Input()
  public review: Review;

  studentValueConst = studentValues;
  lessonThemeValueStr: string = '';
  isTerminated: boolean = false;

  ngOnInit(): void {
    const formattedLessonThemeValues = this.lessonTheme.lessonThemes
      .map((theme) => lessonThemeValues[theme]);
    this.lessonThemeValueStr = this.lessonTheme.other
      ? `${formattedLessonThemeValues.slice(0, -1).join(', ')}, ${this.lessonTheme.other}`
      : formattedLessonThemeValues.join(', ');
  }

  displayGradeDescription(): string {
    switch (this.testOutcome.grade) {
      case 'B':
        return 'Sufficient competence demonstrated to permit entry to the Register of Approved Driving Instructors';
      case 'A':
        return 'A high overall standard of instruction demonstrated';
      default:
        return 'Unsatisfactory Performance';
    }
  }
}