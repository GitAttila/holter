import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { RoomToolbarService } from '../../../services/room-toolbar.service';
import { ResizeService } from '../../../services/resize.service';
import { ChartService } from '../../../services/chart.service';
import { IChartSeries } from 'src/app/models/chartdata.model';
import { IRoomToolbarItem } from '../../../models/room-toolbar.model';
import { DataService } from '../../../services/data.service';
import { Subject, Observable } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import * as shape from 'd3-shape';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-analytics-room',
  templateUrl: './analytics-room.component.html',
  styleUrls: ['./analytics-room.component.scss']
})
export class AnalyticsRoomComponent implements OnInit, AfterViewInit, OnDestroy {
  public resizeObservable$: Observable<Event>;
  private unsubscribe: Subject<void> = new Subject();

  public fullWidthContainer: boolean | string;
  public toolbarConfig: IRoomToolbarItem[];

  public navChartsData: IChartSeries[];

  public insData: IChartSeries[];

  public chart: any;

  @ViewChild('navigatorWrapper', {static: true}) navigatorWrapper: ElementRef;
  @ViewChild('inspectorWrapper', {static: true}) inspectorWrapper: ElementRef;
  @ViewChild('chartscreen', {static: true}) chartscreen: ElementRef;
  @ViewChild('chartcanvas', {static: true}) chartcanvas: ElementRef;
  @ViewChild('downloadLink', {static: true}) downloadLink: ElementRef;

  public navChartWidth;
  public navChartHeight;
  public insChartWidth;
  public insChartHeight;

  public navZoomfactor = 3;

  public chartNavConfig = {
    width: 200,
    height: 100,
    colorScheme: {
      domain: ['#9370DB', '#87CEFA', '#FA8072', '#FF7F50', '#90EE90', '#9370DB']
    },
    showXAxis: false,
    showYAxis: false,
    // yScaleMin: 1.260,
    // yScaleMax: 1.265,
    autoscale: true,
    timeline: true,
    curve: shape.curveNatural,
    gridlines: true
  };

  public insChartConfig = {
    colorScheme : {
      domain: ['#9370DB', '#87CEFA', '#FA8072', '#FF7F50', '#90EE90', '#9370DB']
    },
    showXAxis: true,
    showYAxis: true,
    timeline: false,
    autoscale: true,
    curve: shape.curveNatural
  };

  inspectorViewBarConfig =
  [
    {
      type: 'icon-button',
      label: 'photo',
      name: 'photo',
      color: 'primary',
      disabled: false,
      value: true
    }
  ];

  public navSettingsConfig =
  [
    {
      title: 'lead',
      type: 'select',
      options:
        [
            ['channel1', 'channel 1'],
            ['channel2', 'channel 2'],
            ['channel3', 'channel 3']
        ]
    },
    {
      title: 'gain',
      type: 'select',
      options:
        [
          ['gain1', '0.5'],
          ['gain2', '1'],
          ['gain3', '1.5'],
          ['gain4', '2']
        ]
    },
    {
      title: 'zoom',
      type: 'select',
      options:
        [
          ['zoom1', '4 mins'],
          ['zoom2', '8 mins'],
          ['zoom3', '12 mins'],
          ['zoom4', '16 mins']
        ]
    }
  ];

  public insSettingsConfig =
  [
    {
      title: 'markers',
      type: 'select',
      options:
        [
            ['markersSet1', 'Venticular markers'],
            ['markersSet2', 'Atrial markers'],
            ['markersSet3', 'some other markers']
        ]
    }
  ];

  public sizeChartArea = 70;
  public sizeSettings = 30;
  public sizeNavigator = 50;
  public sizeInspector = 50;

  public activeEntrs = [];

  public dataSource = {chart: {}, data: {}};

  constructor(
    private roomToolbarSvc: RoomToolbarService,
    private dataSvc: DataService,
    private chartSvc: ChartService,
    private resizeSvc: ResizeService,
    private cdref: ChangeDetectorRef
  ) {}

  onFilter(event) {
    console.log('filter event: ', event);
  }

  onInspectorToolbarEvent(itemName: string) {
    if (itemName === 'photo') {
      console.log(this.chartscreen.nativeElement );
      html2canvas(this.chartscreen.nativeElement).then(canvas => {
        console.log(canvas);
        this.chartcanvas.nativeElement.src = canvas.toDataURL();
        this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
        this.downloadLink.nativeElement.download = 'chart.png';
        this.downloadLink.nativeElement.click();
      });
    }
  }

  updateChartsSize() {
    const navChartWidth = this.chartSvc.getContainerSize(this.navigatorWrapper, this.navZoomfactor ).containerWidth;
    const navChartHeight = this.chartSvc.getContainerSize(this.navigatorWrapper, this.navZoomfactor ).containerHeight;
    this.chartNavConfig = Object.assign(this.chartNavConfig, {width: navChartWidth, height: navChartHeight});
    this.insChartWidth = this.chartSvc.getContainerSize(this.inspectorWrapper).containerWidth;
    this.insChartHeight = this.chartSvc.getContainerSize(this.inspectorWrapper).containerHeight;
  }

  onTransitionEnd() {
    this.updateChartsSize();
  }

  toggleSettings(state: boolean | string) {
    if (state) {
      this.sizeSettings = 30;
      this.sizeChartArea = 70;
    } else {
      this.sizeSettings = 0;
      this.sizeChartArea = 100;
    }
    this.updateChartsSize();
  }

  toggleInspector(state: boolean | string) {
    if (state) {
      this.sizeNavigator = 50;
      this.sizeInspector = 50;
    } else {
      this.sizeNavigator = 100;
      this.sizeInspector = 0;
    }
    this.updateChartsSize();
  }

  onSettingsDragEnd(e: { gutterNum: number; sizes: Array<number> }) {
    // console.log(e);
    const settingsVal = this.roomToolbarSvc.getToolbarItemState('settings');
    if (e.sizes[1] <= 0) {
      this.roomToolbarSvc.setToolbarItemState('settings', false);
    } else {
      if (!settingsVal.value) {
        this.roomToolbarSvc.setToolbarItemState('settings', true);
      }
    }
    this.updateChartsSize();
  }

  onInspectorDragEnd(e: { gutterNum: number; sizes: Array<number> }) {
    // console.log(e);
    const settingsVal = this.roomToolbarSvc.getToolbarItemState('inspector');
    if (e.sizes[1] <= 0) {
      this.roomToolbarSvc.setToolbarItemState('inspector', false);
    } else {
      if (!settingsVal.value) {
        this.roomToolbarSvc.setToolbarItemState('inspector', true);
      }
    }
    this.updateChartsSize();
  }

  ngOnInit() {

    this.resizeSvc.onResize$
      .pipe(
        takeUntil(this.unsubscribe),
        debounceTime(500)
      )
      .subscribe( (size) => {
        // console.log(size);
        this.updateChartsSize();
      });

    this.toolbarConfig = this.roomToolbarSvc.roomToolbarConfig;

    this.roomToolbarSvc.getRoomToolbarListener()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(config => {
        config.map((item, index) => {
          if (item.type === 'slide-toggle') {
            if (item.name === 'fullwidth') {
              this.fullWidthContainer = item.value;
            } else if (item.name === 'settings') {
              this.toggleSettings(item.value);
            } else if (item.name === 'inspector') {
              this.toggleInspector(item.value);
            }
          }
        });
      });

    this.dataSvc.getData();

    this.dataSvc.getDataListener()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((vals: any) => {
        console.log(vals);
        this.navChartsData = [
            {
              name: 'data1',
              series: vals
            }];

      });

    this.dataSvc.getDataStrip()
    .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (vals) => {
          console.log(vals);
          this.insData =
            [
              {
                name: 'ECG',
                series: vals
              }
            ];
        });

  }

  ngAfterViewInit() {
    this.updateChartsSize();
    this.cdref.detectChanges();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}

