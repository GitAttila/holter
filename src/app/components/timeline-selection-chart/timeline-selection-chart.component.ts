import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  BaseChartComponent,
  ColorHelper,
  getUniqueXDomainValues,
  getScaleType,
  ViewDimensions,
  calculateViewDimensions,
  id
} from '@swimlane/ngx-charts';
import { scaleLinear, scaleTime, scalePoint } from 'd3-scale';
import { curveLinear } from 'd3-shape';
import { brushX } from 'd3-brush';
import { select, event as d3event } from 'd3-selection';

@Component({
  selector: 'app-timeline-selection-chart',
  template: `
    <ngx-charts-chart
    class="timeline-selection-chart"
      [view]="[width, height]"
      [showLegend]="legend"
      [legendOptions]="legendOptions"
      [animations]="animations"
      >
      <svg:defs>
        <svg:clipPath [attr.id]="clipPathId">
          <svg:rect
            [attr.width]="dims.width + 10"
            [attr.height]="dims.height + 10"
            [attr.transform]="'translate(-5, -5)'"
          />
        </svg:clipPath>
      </svg:defs>
      <svg:g [attr.transform]="transform" class="line-chart chart">
        <svg:g
          ngx-charts-x-axis
          *ngIf="xAxis"
          [xScale]="xScale"
          [dims]="dims"
          [showGridLines]="showGridLines"
          [showLabel]="showXAxisLabel"
          [labelText]="xAxisLabel"
          [trimTicks]="trimXAxisTicks"
          [rotateTicks]="rotateXAxisTicks"
          [maxTickLength]="maxXAxisTickLength"
          [tickFormatting]="xAxisTickFormatting"
          [ticks]="xAxisTicks"
          (dimensionsChanged)="updateXAxisHeight($event)"
        ></svg:g>
        <svg:g
          ngx-charts-y-axis
          *ngIf="yAxis"
          [yScale]="yScale"
          [dims]="dims"
          [showGridLines]="showGridLines"
          [showLabel]="showYAxisLabel"
          [labelText]="yAxisLabel"
          [trimTicks]="trimYAxisTicks"
          [maxTickLength]="maxYAxisTickLength"
          [tickFormatting]="yAxisTickFormatting"
          [ticks]="yAxisTicks"
          [referenceLines]="referenceLines"
          [showRefLines]="showRefLines"
          [showRefLabels]="showRefLabels"
          (dimensionsChanged)="updateYAxisWidth($event)"
        ></svg:g>

        <svg:g [attr.clip-path]="clipPath">
          <svg:g *ngFor="let series of results; trackBy: trackBy">
            <svg:g
              ngx-charts-line-series
              [xScale]="xScale"
              [yScale]="yScale"
              [colors]="colors"
              [data]="series"
              [scaleType]="scaleType"
              [curve]="curve"
              [rangeFillOpacity]="rangeFillOpacity"
              [hasRange]="hasRange"
              [animations]="animations"
            /></svg:g>
          </svg:g>
        </svg:g>

        <svg:g [attr.transform]="transform" class="timeline">
          <svg:filter [attr.id]="filterId">
            <svg:feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0"
            />
          </svg:filter>
          <svg:rect x="0" [attr.width]="dims.width" y="0" [attr.height]="dims.height" class="brush-background" />
          <svg:g class="brush"></svg:g>
        </svg:g>
    </ngx-charts-chart>
  `,
  styleUrls: ['./timeline-selection-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineSelectionChartComponent extends BaseChartComponent {
  @Input() legend;
  @Input() legendTitle: string = 'Legend';
  @Input() legendPosition: string = 'right';
  @Input() view: [number, number];
  @Input() results: any;
  @Input() scheme: any;
  @Input() xAxis;
  @Input() yAxis;
  @Input() showXAxisLabel;
  @Input() showYAxisLabel;
  @Input() xAxisLabel;
  @Input() yAxisLabel;
  @Input() autoScale;
  @Input() gradient: boolean;
  @Input() showGridLines: boolean = true;
  @Input() curve: any = curveLinear;
  @Input() schemeType: string;
  @Input() rangeFillOpacity: number;
  @Input() trimXAxisTicks: boolean = true;
  @Input() trimYAxisTicks: boolean = true;
  @Input() rotateXAxisTicks: boolean = true;
  @Input() maxXAxisTickLength: number = 16;
  @Input() maxYAxisTickLength: number = 16;
  @Input() xAxisTickFormatting: any;
  @Input() yAxisTickFormatting: any;
  @Input() xAxisTicks: any[];
  @Input() yAxisTicks: any[];
  @Input() roundDomains: boolean = false;
  @Input() showRefLines: boolean = false;
  @Input() referenceLines: any;
  @Input() showRefLabels: boolean = true;
  @Input() xScaleMin: any;
  @Input() xScaleMax: any;
  @Input() yScaleMin: number;
  @Input() yScaleMax: number;

  @Output() onFilter = new EventEmitter();

  dims: ViewDimensions;
  xSet: any;
  xDomain: any;
  yDomain: any;
  seriesDomain: any;
  yScale: any;
  xScale: any;
  colors: ColorHelper;
  scaleType: string;
  transform: string;
  clipPath: string;
  clipPathId: string;
  series: any;
  areaPath: any;
  margin = [10, 10, 20, 10];
  hoveredVertical: any; // the value of the x axis that is hovered over
  xAxisHeight: number = 0;
  yAxisWidth: number = 0;
  filteredDomain: any;
  legendOptions: any;
  hasRange: boolean; // whether the line has a min-max range around it

  timeScale: any;
  initialized: boolean = false;
  filterId: any;
  filter: any;
  brush: any;
  lastSelection: any;

  update(): void {
    super.update();

    this.dims = calculateViewDimensions({
      width: this.width,
      height: this.height,
      margins: this.margin,
      showXAxis: this.xAxis,
      showYAxis: this.yAxis,
      xAxisHeight: this.xAxisHeight,
      yAxisWidth: this.yAxisWidth,
      showXLabel: this.showXAxisLabel,
      showYLabel: this.showYAxisLabel,
      showLegend: this.legend,
      legendType: this.schemeType,
      legendPosition: this.legendPosition
    });

    this.xDomain = this.getXDomain();
    if (this.filteredDomain) {
      this.xDomain = this.filteredDomain;
    }

    this.yDomain = this.getYDomain();
    this.seriesDomain = this.getSeriesDomain();

    this.timeScale = this.getTimeScale(this.xDomain, this.dims.width);

    this.xScale = this.getXScale(this.xDomain, this.dims.width);
    this.yScale = this.getYScale(this.yDomain, this.dims.height);

    this.setColors();
    this.legendOptions = this.getLegendOptions();

    this.transform = `translate(${this.dims.xOffset} , ${this.margin[0]})`;

    this.clipPathId = 'clip' + id().toString();
    this.clipPath = `url(#${this.clipPathId})`;

    if (this.brush) {
      this.updateBrush();
    }

    this.filterId = 'filter' + id().toString();
    this.filter = `url(#${this.filterId})`;

    if (!this.initialized) {
      this.addBrush();
      this.initialized = true;
    }

  }

  getXDomain(): any[] {
    let values = getUniqueXDomainValues(this.results);

    this.scaleType = getScaleType(values);
    let domain = [];

    if (this.scaleType === 'linear') {
      values = values.map(v => Number(v));
    }

    let min;
    let max;
    if (this.scaleType === 'time' || this.scaleType === 'linear') {
      min = this.xScaleMin ? this.xScaleMin : Math.min(...values);

      max = this.xScaleMax ? this.xScaleMax : Math.max(...values);
    }

    if (this.scaleType === 'time') {
      domain = [new Date(min), new Date(max)];
      this.xSet = [...values].sort((a, b) => {
        const aDate = a.getTime();
        const bDate = b.getTime();
        if (aDate > bDate) {return 1; }
        if (bDate > aDate) {return -1; }
        return 0;
      });
    } else if (this.scaleType === 'linear') {
      domain = [min, max];
      // Use compare function to sort numbers numerically
      this.xSet = [...values].sort((a, b) => a - b);
    } else {
      domain = values;
      this.xSet = values;
    }

    return domain;
  }

  getYDomain(): any[] {
    const domain = [];
    for (const results of this.results) {
      for (const d of results.series) {
        if (domain.indexOf(d.value) < 0) {
          domain.push(d.value);
        }
        if (d.min !== undefined) {
          this.hasRange = true;
          if (domain.indexOf(d.min) < 0) {
            domain.push(d.min);
          }
        }
        if (d.max !== undefined) {
          this.hasRange = true;
          if (domain.indexOf(d.max) < 0) {
            domain.push(d.max);
          }
        }
      }
    }

    const values = [...domain];
    if (!this.autoScale) {
      values.push(0);
    }

    const min = this.yScaleMin ? this.yScaleMin : Math.min(...values);

    const max = this.yScaleMax ? this.yScaleMax : Math.max(...values);

    return [min, max];
  }

  getSeriesDomain(): any[] {
    return this.results.map(d => d.name);
  }

  getXScale(domain, width): any {
    let scale;

    if (this.scaleType === 'time') {
      scale = scaleTime()
        .range([0, width])
        .domain(domain);
    } else if (this.scaleType === 'linear') {
      scale = scaleLinear()
        .range([0, width])
        .domain(domain);

      if (this.roundDomains) {
        scale = scale.nice();
      }
    } else if (this.scaleType === 'ordinal') {
      scale = scalePoint()
        .range([0, width])
        .padding(0.1)
        .domain(domain);
    }

    return scale;
  }

  getYScale(domain, height): any {
    const scale = scaleLinear()
      .range([height, 0])
      .domain(domain);

    return this.roundDomains ? scale.nice() : scale;
  }

  getTimeScale(domain, width): any {
    return scaleTime()
      .range([0, width])
      .domain(domain);
  }

  updateDomain(domain): void {
    this.filteredDomain = domain;
    this.xDomain = this.filteredDomain;
    this.xScale = this.getXScale(this.xDomain, this.dims.width);
  }

  trackBy(index, item): string {
    return item.name;
  }

  setColors(): void {
    let domain;
    if (this.schemeType === 'ordinal') {
      domain = this.seriesDomain;
    } else {
      domain = this.yDomain;
    }

    this.colors = new ColorHelper(this.scheme, this.schemeType, domain, this.customColors);
  }

  getLegendOptions() {
    const opts = {
      scaleType: this.schemeType,
      colors: undefined,
      domain: [],
      title: undefined,
      position: this.legendPosition
    };
    if (opts.scaleType === 'ordinal') {
      opts.domain = this.seriesDomain;
      opts.colors = this.colors;
      opts.title = this.legendTitle;
    } else {
      opts.domain = this.yDomain;
      opts.colors = this.colors.scale;
    }
    return opts;
  }

  updateYAxisWidth({ width }): void {
    this.yAxisWidth = width;
    this.update();
  }

  updateXAxisHeight({ height }): void {
    this.xAxisHeight = height;
    this.update();
  }

  addBrush(): void {
    if (this.brush) {return;}

    const height = this.height;
    const width = this.width;

    this.brush = brushX()
      .extent([
        [0, 0],
        [width, height]
      ])
      .on('brush end', () => {
        const selection = d3event.selection || this.xScale.range();
        const newDomain = selection.map(this.timeScale.invert);
        this.onFilter.emit(newDomain);
        this.lastSelection = [...selection, ...this.xScale.range()];
        this.cd.markForCheck();
      });

    select(this.chartElement.nativeElement)
      .select('.brush')
      .call(this.brush);
  }

  updateBrush(): void {
    if (!this.brush) {return;}

    const height = this.dims.height;
    const width = this.dims.width;

    this.brush.extent([
      [0, 0],
      [width, height]
    ]);
    select(this.chartElement.nativeElement)
    .select('.brush')
    .call(this.brush);

    if (this.lastSelection) {
      if (this.lastSelection[0] !== this.lastSelection[2] && this.lastSelection[1] !== this.lastSelection[3]) {
        const updateSel =
        scaleLinear()
          .domain([this.lastSelection[2], this.lastSelection[3]])
          .range(this.xScale.range())
          .clamp(true);

        this.lastSelection = [updateSel(this.lastSelection[0]), updateSel(this.lastSelection[1]), ...this.xScale.range()];
        this.brush.move(
          select(this.chartElement.nativeElement).select('.brush'),
          this.lastSelection
        );
      }
    }

    // clear hardcoded properties so they can be defined by CSS
    select(this.chartElement.nativeElement)
      .select('.selection')
      .attr('fill', undefined)
      .attr('stroke', undefined)
      .attr('fill-opacity', undefined);

    this.cd.markForCheck();
  }

}
