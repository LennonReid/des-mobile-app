import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { PassCertificateNumberCatAMod1Component } from './pass-certificate-number/pass-certificate-number.cat-a-mod1';

@NgModule({
  declarations: [
    PassCertificateNumberCatAMod1Component,
  ],
  imports: [
    IonicModule,
    CommonModule,
    ComponentsModule,
    ReactiveFormsModule,
  ],
  exports: [
    PassCertificateNumberCatAMod1Component,
  ],
})
export class PassFinalisationCatAMod1ComponentsModule {}
