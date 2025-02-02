import { TestBed, waitForAsync, ComponentFixture } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

import { CategoryWhitelistProvider } from '@providers/category-whitelist/category-whitelist';
import { PracticeModeBanner } from '../practice-mode-banner';

describe('PracticeModeBanner', () => {
  let fixture: ComponentFixture<PracticeModeBanner>;
  let component: PracticeModeBanner;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PracticeModeBanner],
      imports: [IonicModule, RouterTestingModule, StoreModule.forRoot({
        tests: () => ({
          currentTest: { testCategory: TestCategory.B },
          testStatus: {},
          startedTests: {},
        }),
      })],
      providers: [
        { provide: Router, useValue: routerSpy },
        CategoryWhitelistProvider,
      ],
    });

    fixture = TestBed.createComponent(PracticeModeBanner);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('exitPracticeMode', () => {
      it('should take the user back to the root page', () => {
        component.exitPracticeMode();
        expect(routerSpy.navigate).toHaveBeenCalled();
      });
    });
  });
});
