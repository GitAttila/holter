import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { IDataModel } from '../models/data.model';
import { _countGroupLabelsBeforeOption } from '@angular/material';

@Injectable()
export class DataService {
  private dataUpdated = new Subject<[{name: Date, value: number}]>();

  constructor(private http: HttpClient) {}

  parseTime(time: string): Date {
    const timeParts = time.split(':');
    const hrs = parseInt(timeParts[0], 10);
    const mins = parseInt(timeParts[1], 10);
    const secs = parseInt(timeParts[2], 10);
    const milisecs = Math.round((parseFloat(timeParts[2]) - secs) * 1000);
    const newDate = new Date(2019, 11, 30, hrs, mins, secs, milisecs);
    return newDate;
  }

  remap(dat, density?: number, dataChannel?: 'll_ra_data_raw' | 'c_la_data_raw', option?: string) {
    density = density || 1;
    dataChannel = dataChannel || 'c_la_data_raw';
    option = option || '';
    const newDataArr = [];
    let dataToPush;
    Object.keys(dat.timestamp).forEach( (key) => {
      // console.log(key, dat.timestamp[key], dat.c_la_data_raw[key]);
      if (parseInt(key, 10) % density === 0) {
        if ( option === '' ) {
          dataToPush = {
            name: this.parseTime(dat.timestamp[key]),
            value: dat[dataChannel][key]
          };
        } else if  ( option === 'tuples' ) {
          dataToPush = [
            this.parseTime(dat.timestamp[key]),
            dat[dataChannel][key]
          ];
        }
        newDataArr.push(dataToPush);
      }
    });
    return newDataArr;
  }

  getData() {
    this.http.get<IDataModel>('http://localhost:3000/api//data')
      .pipe(
        map( data => {
            return this.remap(data, 10, 'll_ra_data_raw', '');
          }
        )
      )
      .subscribe(
        (data: [{name: Date, value: number}]) => {
          this.dataUpdated.next(data);
        }
      );
  }

  getDataListener() {
    return this.dataUpdated.asObservable();
  }

  getDataStrip(startTime?: Date, endTime?: Date) {
    startTime = startTime || new Date(2019, 11, 30, 14, 21, 26, 200);
    endTime = endTime || new Date(2019, 11, 30, 14, 21, 27, 400);
    return this.dataUpdated
      .pipe(
        map((data) => {
          return data.filter( (dataItem) => {
            if (dataItem.name !== undefined) {
              return (dataItem.name >= startTime && dataItem.name <= endTime);
            } else {
              return (dataItem[0] >= startTime && dataItem[0] <= endTime);
            }
          });
        }),
        // map((itemArr) => {
        //   return itemArr.map((item, ind) => {
        //     if (item.name !== undefined) {
        //       return item;
        //     } else {
        //       return [item[0], item[1] ];
        //     }
        //   });
        // })
      );
  }

}
