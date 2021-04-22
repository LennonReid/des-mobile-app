import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { NavMock } from '@mocks/angular-mocks/nav-mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';

import { BackToOfficeCatAdiPart2Page } from '../back-to-office.cat-adi-part2.page';

describe('BackToOfficeCatADIPart2Page', () => {
  let component: BackToOfficeCatAdiPart2Page;
  let fixture: ComponentFixture<BackToOfficeCatAdiPart2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BackToOfficeCatAdiPart2Page],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: NavController, useClass: NavMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BackToOfficeCatAdiPart2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
