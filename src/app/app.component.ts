import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Component} from "@angular/core";
import {AppRoutingAdminPrivateModule} from "./app-routing-admin-private.module";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  imports: [AppRoutingAdminPrivateModule, FormsModule, ReactiveFormsModule],
  // ⚠️ no "standalone: true" here, so it can stay in AppModule
})
export class AppComponent {
  title = "angular-ui";
}
