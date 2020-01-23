import { Component, Input } from '@angular/core';
import { IChartSeries } from '../../models/chartdata.model';
import { IChartConfig } from '../../models/chartconfig.model';

@Component({
  selector: 'app-waveform-chart',
  templateUrl: './waveform-chart.component.html',
  styleUrls: ['./waveform-chart.component.scss']
})
export class WaveformChartComponent {
  @Input() dataSeries: IChartSeries[];
  @Input() chartConfig: IChartConfig;

  constructor() { }


}
