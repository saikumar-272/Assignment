import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PARENT_PRIVATE_CHILDREN_ROUTES_BASE} from './app-routing.parent-private-children-routes.base';

const routes: Routes = [
  {
    path: '',
    children: [
      //Private custom routes

      //Private base routes
      ...PARENT_PRIVATE_CHILDREN_ROUTES_BASE
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingParentPrivateModule { }
