import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './routing-management.component.html',
  styleUrls: ['./routing-management.component.scss']
})
export class RoutingManagementComponent {
  constructor(private currentRoute: ActivatedRoute, private router: Router)
  {
    let urlParams : any = {};
    this.currentRoute.queryParams.subscribe(params => 
    {
      Object.entries(params).forEach(([key, value]) => {
        if(key != "path")
        {
          urlParams[key] = value;
        }  
      });

      let urlPath = params['path'];
      if (urlPath && urlPath.length > 0) {
        this.router.navigate([urlPath], {
          queryParams: urlParams
        });
      }
      else {
        this.router.navigate(["in"]);
      }
    });
  }
}
