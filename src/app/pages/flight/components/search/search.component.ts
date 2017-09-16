import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Flight} from '../../../../core/api/models/flight';
import {FlightService} from '../../services/flight.service';

@Component({
  selector: 'search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {

  searchResult$: Observable<Flight[]>
  isFindPending$: Observable<boolean>

  searchForm: FormGroup

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private fs: FlightService
  ) {

    // setup form
    this.searchForm = fb.group({
      from: [],
      to: []
    })

    this.route.params.subscribe(
      (data: { from: string, to: string }) => {
        const searchFormData = Object.assign({from: '', to: ''}, data)
        this.searchForm.patchValue(searchFormData)

        // this.fs.find(data.from, data.to)
      }
    )

    this.searchResult$ = this.fs.flights$
      .map(flights => flights.sort(this.orderByDate))
    this.isFindPending$ = this.fs.isFindPending$
  }

  ngOnInit() {
    // this.refreshFlights()
  }

  trackByDate(index: number, item: Flight) {
    return item.id
  }

  searchFlights(form: FormGroup) {
    const data = form.value
    // this.fs.find(data.from, data.to)
    this.router.navigate(['./', {from: data.from, to: data.to}])
  }

  refreshFlights() {
    this.fs.find(null, null)
  }

  private orderByDate(a, b) {
    a = new Date(a.date).getTime();
    b = new Date(b.date).getTime();
    return a > b ? -1 : a < b ? 1 : 0;
  }

}
