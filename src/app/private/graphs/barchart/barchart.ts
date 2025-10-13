import {Component} from "@angular/core";
import {ChartType} from "chart.js";
import {NgChartsModule} from "ng2-charts";

@Component({
  selector: "barchart",
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: "./barchart.html",
})
export class BarChartComponent {
  public graphHeaderLabel: any = "";
  public barChartOptions: any = {
    scaleShowVerticalLines: true,
    responsive: true,
  };
  /*
  public mbarChartLabels: string[] = [
    '2012',
    '2013',
    '2014',
    '2015',
    '2016',
    '2017',
    '2018'];
    public barChartData: any[] = [
    { data: [56, 60, 75, 82, 56, 62, 80], label: 'Company A' },
    { data: [58, 56, 60, 79, 66, 57, 90], label: 'Company B' }];*/
  public mbarChartLabels: string[] = [];
  public barChartData: any[] = [];
  public barChartType: ChartType = "bar";
  public barChartLegend: boolean = true;

  public barChartColors: Array<any> = [
    {
      backgroundColor: "rgba(105,159,177,0.2)",
      borderColor: "rgba(105,159,177,1)",
      pointBackgroundColor: "rgba(105,159,177,1)",
      pointBorderColor: "#fafafa",
      pointHoverBackgroundColor: "#fafafa",
      pointHoverBorderColor: "rgba(105,159,177)",
    },
    {
      backgroundColor: "rgba(77,20,96,0.3)",
      borderColor: "rgba(77,20,96,1)",
      pointBackgroundColor: "rgba(77,20,96,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(77,20,96,1)",
    }];

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  callBarchartMethod(
    graphHeaderLabel: String,
    barchartLabels: any,
    barChartData: any
  ) {
    this.graphHeaderLabel = graphHeaderLabel;
    this.mbarChartLabels = barchartLabels;
    this.barChartData = barChartData;
  }
}
