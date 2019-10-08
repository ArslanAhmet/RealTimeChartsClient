import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { ChartModel, GaugeModel } from '../chart-model';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  public data: ChartModel[];
  public bradcastedData: ChartModel[];
  public temperatureData: ChartModel[];
  private hubConnection: signalR.HubConnection

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:44311/Kardemir')
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  public addTransferChartDataListener = () => {
    this.hubConnection.on('transferchartdata', (data) => {
      this.getTemperature(data);
      this.data  = data;
      console.log('temperatureData');
      console.log(this.temperatureData);
      console.log('data');
      console.log(data);
    });
  }
  public getTemperature(signalrData: ChartModel[]) {

    this.temperatureData = [];
    for (let i = 0; i < signalrData.length; i++) {
      // this.temperatureData[i]  =  [data[i].data, data[i].label];
      console.log('signalrData');
      this.temperatureData[i].data = [];

      console.log(signalrData[i].data);
      this.temperatureData[i].data = signalrData[i].data;
      this.temperatureData[i].label = signalrData[i].label;
    }
    // data: [
    //   ['Memory', 50],
    //   ['CPU', 99]
    // ],
  }

  public broadcastChartData = () => {
    this.hubConnection.invoke('broadcastchartdata', this.data)
      .catch(err => console.error(err));
  }

  public addBroadcastChartDataListener = () => {
    this.hubConnection.on('broadcastchartdata', (data) => {
      this.bradcastedData = data;
    })
  }
}
