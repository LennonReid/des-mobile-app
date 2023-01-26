import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Code4Modal } from '@pages/test-report/cat-adi-part3/components/code-4-modal/code-4-modal';
import { ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';

describe('Code4Modal', () => {
  let fixture: ComponentFixture<Code4Modal>;
  let component: Code4Modal;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        Code4Modal,
      ],
      providers: [
        { provide: ModalController, useClass: ModalControllerMock },
      ],
    });

    fixture = TestBed.createComponent(Code4Modal);
    component = fixture.componentInstance;
  }));

  describe('dismiss', () => {
    it('should call dismiss with the variable passed in', () => {
      spyOn(component['modalCtrl'], 'dismiss');
      component.dismiss(false);
      expect(component['modalCtrl'].dismiss).toHaveBeenCalledWith(false);
    });
  });
});
