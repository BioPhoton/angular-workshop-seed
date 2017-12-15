import {
  ChangeDetectionStrategy,
  Component, EventEmitter, Input, OnChanges, OnInit,
  Output, SimpleChanges
} from '@angular/core';
import {Flight} from '../../../../core/api/models/flight';

@Component({
  selector: 'app-flight-card',
  templateUrl: './flight-card.component.html',
  styleUrls: ['./flight-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlightCardComponent implements OnChanges {

  @Input() flight: Flight;
  @Input() selected: boolean;
  @Output() selectedChange: EventEmitter<string> = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges): void {

  }


  toggleSelect() {
    this.selectedChange.emit(this.flight.id);
  }

}
