import { Component, OnInit } from "@angular/core";
import { AppRoutingAdminPrivateModule } from "src/app/app-routing-admin-private.module";

@Component({
  selector: "app-print",
  imports: [AppRoutingAdminPrivateModule],
  templateUrl: "./print.component.html",
  styleUrls: ["./print.component.scss"],
  standalone: true,
})
export class PrintComponent implements OnInit {
  ngOnInit(): void {}
}
