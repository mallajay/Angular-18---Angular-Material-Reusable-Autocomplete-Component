import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ReusableAutocompleteComponent } from './reusable-autocomplete/reusable-autocomplete.component';
import {
  FormGroup,
  ReactiveFormsModule,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ReusableAutocompleteComponent,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
  template: `
  <div style="padding: 4rem">
  <form [formGroup]="form">
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-3">
          <app-reusable-autocomplete
            placeholder="Select Country Name"
            formControlName="country"
            [options]="countryList"
            displayField="name"
            valueField="name"
            (selectionChange)="onOptionSelected($event)"
            [required]="true"
          >
          </app-reusable-autocomplete>

          @if(form.get('country')?.invalid && form.get('country')?.touched)
          {
          <mat-error >
            This field is required!!.
          </mat-error>
          }
        </div>

        <div class="col-span-3">
          <app-reusable-autocomplete
            formControlName="weekDay"
            [options]="weekDayList"
            displayField="day"
            valueField="day"
            (selectionChange)="onOptionSelected($event)"
          >
          </app-reusable-autocomplete>

          @if(form.get('weekDay')?.invalid && form.get('weekDay')?.touched) {
          <mat-error *ngIf="form.get('weekDay')?.hasError('required')">
            This field is required!!.
          </mat-error>
          }
        </div>

        <button mat-flat-button (click)="onSubmit()">Submit</button>
      </div>
    </form>


    <div>
          {{formValue | json}}
  </div>

</div>
  `,
})
export class App {
  name = 'Angular';

  countryList = [
    {
      name: 'India',
      capital: 'New Delhi',
      language: 'Hindi, English',
    },
    {
      name: 'United States',
      capital: 'Washington, D.C.',
      language: 'English',
    },
    {
      name: 'France',
      capital: 'Paris',
      language: 'French',
    },
    {
      name: 'Japan',
      capital: 'Tokyo',
      language: 'Japanese',
    },
    {
      name: 'Brazil',
      capital: 'Brasília',
      language: 'Portuguese',
    },
  ];

  weekDayList = [
    {
      day: 'Monday',
      description: 'Start of the work week',
      shortForm: 'Mon',
    },
    {
      day: 'Tuesday',
      description: 'Second day of the work week',
      shortForm: 'Tue',
    },
    {
      day: 'Wednesday',
      description: 'Midweek day',
      shortForm: 'Wed',
    },
    {
      day: 'Thursday',
      description: 'Almost the weekend',
      shortForm: 'Thu',
    },
    {
      day: 'Friday',
      description: 'Last day of the work week',
      shortForm: 'Fri',
    },
  ];

  formValue: any;

  public form = new FormGroup({
    country: new UntypedFormControl(null, [Validators.required]),
    weekDay: new UntypedFormControl(null, [Validators.required]),
  });

  onOptionSelected(selectedOption: any) {
    console.log('Selected option:', selectedOption);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log('this.myForm.value.myControl', this.form.value);

    this.formValue = this.form.value;
  }
}

bootstrapApplication(App, {
  providers: [provideAnimationsAsync()],
});
