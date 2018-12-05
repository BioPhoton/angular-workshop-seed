import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {pluck, switchMap, tap} from 'rxjs/operators';
import {FlightService} from '../services/flight.service';
import {Flight} from 'flight-api/src/lib/models/flight';

@Component({
  selector: 'flight-edit',
  templateUrl: './flight-edit.component.html'
})
export class FlightEditComponent implements OnInit {

  formGroup: FormGroup;

  id: string;
  flight: Flight;
  message: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private flightService: FlightService
  ) {
    this.formGroup = this.createFrom();
  }

  ngOnInit(): void {
    this.route
      .data
      .pipe(
        pluck<object, Flight>('flight'),
      )
      .subscribe((flight: Flight) => {
        this.patchForm(flight);
      });
  }


  save(fg) {
    this.flight = Object.assign({}, this.flight, fg.value);
    this
      .flightService
      .create(this.flight)
      .subscribe(
        flight => {
          this.patchForm(flight);
          this.message = 'Erfolgreich gespeichert!';
        },
        err => {
          this.message = 'Fehler: ' + err.message;
        }
      );
  }

  patchForm(flight: Flight) {
    this.formGroup.patchValue(flight);
  }

  createFrom() {

    return this.fb.group({
      'id': [null],
      'from': [null,
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],
      'to': [null],
      'date': [null]
    });
  }

}
