export interface IDataModel {
  timestamp: {
    [index: number]: number
  };
  ll_ra_data_raw: {
    [index: number]: number
  };
  c_la_data_raw: {
    [index: number]: string
  };
}
