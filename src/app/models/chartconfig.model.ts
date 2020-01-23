export interface IColorScheme {
  domain: string[]
}

export interface IChartConfig {
  width: number;
  height: number;
  colorScheme: IColorScheme;
  showXAxis: boolean;
  showYAxis: boolean;
  timeline: boolean;
  autoscale: boolean;
  yScaleMin: number;
  yScaleMax: number;
}


