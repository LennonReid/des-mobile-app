import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestFlowPageNames } from '@pages/page-names.constants';

@Component({
  selector: 'app-test-report-cat-d',
  templateUrl: './test-report.cat-d.page.html',
  styleUrls: ['./test-report.cat-d.page.scss'],
})
export class TestReportCatDPage implements OnInit {

  constructor(
    private navController: NavController,
    public routeByCat: RouteByCategoryProvider,
  ) { }

  ngOnInit() {
  }

  navigateBack(): void {
    this.navController.back();
  }

  async navigateForward(): Promise<void> {
    await this.routeByCat.navigateToPage(TestFlowPageNames.DEBRIEF_PAGE, TestCategory.D);
  }

}