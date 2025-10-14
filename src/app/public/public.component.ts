import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit } from "@angular/core";
import { AppRoutingAdminPrivateModule } from "../app-routing-admin-private.module";

@Component({
  selector: "app-public",
  imports: [AppRoutingAdminPrivateModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./public.component.html",
  styleUrls: ["./public.component.scss"],
  standalone: true,
})
export class PublicComponent implements OnInit {
  ngOnInit(): void {}
}
