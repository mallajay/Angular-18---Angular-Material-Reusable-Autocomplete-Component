import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

type Option = {
  [key: string]: any;
};

@Component({
  selector: 'app-reusable-autocomplete',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    AsyncPipe,
  ],
  templateUrl: './reusable-autocomplete.component.html',
  styleUrl: './reusable-autocomplete.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ReusableAutocompleteComponent),
      multi: true,
    },
  ],
})
export class ReusableAutocompleteComponent<T extends Option>
  implements OnInit, ControlValueAccessor
{
  @Input() options: T[] = [];
  @Input() displayField: string = 'label';
  @Input() valueField: string = 'id';
  @Input() required: boolean = false;
  @Input() isLoading: boolean = false;
  @Input() placeholder: string = 'Choose an option';

  @Output() selectionChange = new EventEmitter<T | undefined>();

  myControl = new FormControl('');
  filteredOptions: Observable<T[]> = new Observable<T[]>();

  private onChange = (value: any) => {};
  private onTouched = () => {};

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );

    this.myControl.valueChanges.subscribe((value) => {
      this.onChange(value);
      this.onTouched();
    });
  }

  private _filter(value: any): T[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    return this.options.filter((option) =>
      (option[this.displayField] as unknown as string)
        .toLowerCase()
        .includes(filterValue)
    );
  }

  onOptionSelected(event: any) {
    const selectedOption = this.options.find(
      (option) => option[this.valueField] === event.option.value
    );
    if (selectedOption) {
      this.myControl.setValue(selectedOption[this.valueField]);
      this.selectionChange.emit(selectedOption);
      this.onChange(selectedOption);
    }
  }

  clearValue() {
    this.myControl.setValue('');
    this.selectionChange.emit(undefined);
    this.onChange(null);
  }

  writeValue(value: any): void {
    this.myControl.setValue(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.myControl.disable();
    } else {
      this.myControl.enable();
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (
      this.required &&
      (value === null || value === undefined || value === '')
    ) {
      return { required: true };
    }

    return null;
  }
}
