export interface IChartDataItem {
  value: number;
  name: Date;
}

export interface IChartSeries {
  name: string;
  series: IChartDataItem[];
}

