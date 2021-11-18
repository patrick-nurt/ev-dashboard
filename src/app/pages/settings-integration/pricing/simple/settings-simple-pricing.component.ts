import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

import { PricingSettings } from '../../../../types/Setting';

@Component({
  selector: 'app-settings-simple-pricing',
  templateUrl: 'settings-simple-pricing.component.html',
})
export class SettingsSimplePricingComponent implements OnInit, OnChanges {
  @Input() public formGroup!: FormGroup;
  @Input() public pricingSettings!: PricingSettings;

  public simplePricing!: FormGroup;
  public currency!: AbstractControl;

  public ngOnInit(): void {
    // Simple pricing
    this.simplePricing = new FormGroup({
      currency: new FormControl('',
        Validators.compose([
          Validators.required,
          Validators.maxLength(3),
        ]),
      ),
    });
    // Add
    this.formGroup.addControl('simple', this.simplePricing);
    this.currency = this.simplePricing.controls['currency'];
    // Set
    this.updateFormData();
  }

  public ngOnChanges() {
    this.updateFormData();
  }

  public updateFormData() {
    // Set data
    if (this.simplePricing) {
      this.currency.setValue(this.pricingSettings.simple.currency);
    }
  }
}
