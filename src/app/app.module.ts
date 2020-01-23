import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { WaveformChartComponent } from './components/waveform-chart/waveform-chart.component';
import { RoomToolbarComponent } from './components/room-toolbar/room-toolbar.component';
import { AppExpansionPanelComponent } from './components/app-expansion-panel/app-expansion-panel.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { AnalyticsRoomComponent } from './components/rooms/analytics-room/analytics-room.component';

import { MaterialModule } from './material.module';
import { AngularSplitModule } from 'angular-split';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TimelineSelectionChartComponent } from './components/timeline-selection-chart/timeline-selection-chart.component';

import { ChartModule } from 'angular-highcharts';
import { FusionChartsModule } from 'angular-fusioncharts';

import { RoomToolbarService } from './services/room-toolbar.service';
import { DataService } from './services/data.service';
import { ChartService } from './services/chart.service';
import { ResizeService } from './services/resize.service';

import * as FusionCharts from 'fusioncharts';
import * as charts from 'fusioncharts/fusioncharts.charts';
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';

FusionChartsModule.fcRoot(FusionCharts, charts, FusionTheme);
@NgModule({
  declarations: [
    AppComponent,
    RoomToolbarComponent,
    AppExpansionPanelComponent,
    WelcomeComponent,
    AnalyticsRoomComponent,
    WaveformChartComponent,
    TimelineSelectionChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    AngularSplitModule.forRoot(),
    NgxChartsModule,
    ChartModule,
    FusionChartsModule
  ],
  providers: [
    RoomToolbarService,
    DataService,
    ChartService,
    ResizeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
