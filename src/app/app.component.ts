import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignalRService } from './services/signal-r.service';
import { GoogleChartComponent } from 'angular-google-charts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
  export class AppComponent implements OnInit {
  public chartOptions: any = {
    scaleShowVerticalLines: true,
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };
  public chartLabels: string[] = ['Real time data for the chart'];
  public chartType: string = 'bar';
  public chartLegend: boolean = true;
  public colors: any[] = [{ backgroundColor: '#5491DA' }, { backgroundColor: '#E74C3C' }, { backgroundColor: '#82E0AA' }, { backgroundColor: '#E5E7E9' }]

  constructor(public signalRService: SignalRService, private http: HttpClient) { }

  @ViewChild('googlechart')
  googlechart: GoogleChartComponent;
  chart = {
    title: 'Sicaklık',
    type: 'Gauge',
    // data: [
    //   ['Memory', 50],
    //   ['CPU', 99]
    // ],
     data: this.signalRService.temperatureData  ,
    options: {
      width: 400,
      height: 120,
      greenFrom: 0,
      greenTo: 75,
      redFrom: 90,
      redTo: 100,
      yellowFrom: 75,
      yellowTo: 90,
      minorTicks: 5
    }
  };

  ngOnInit() {
    this.signalRService.startConnection();
    this.signalRService.addTransferChartDataListener();
    this.signalRService.addBroadcastChartDataListener();
    this.startHttpRequest();
  }

  private startHttpRequest = () => {
    this.http.get('https://localhost:44311/api/Kardemir')
      .subscribe(res => {
        console.log(res);
      })
  }

  public chartClicked = (event) => {
    console.log('this.chart.data:');
    console.log(this.chart.data);
    console.log(event);
    this.signalRService.broadcastChartData();
  }
}
