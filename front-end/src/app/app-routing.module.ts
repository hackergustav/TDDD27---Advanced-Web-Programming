import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CallbackComponent } from './callback.component';
import { BlockeditComponent } from './blockedit/blockedit.component';
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';
import { NotAuthComponent } from './not-auth/not-auth.component';
import { GroupsComponent } from './groups/groups.component';
import { GroupDocOverviewComponent } from './documents/group-doc-overview/group-doc-overview.component';
import {StartComponent} from './start/start.component';

const routes: Routes = [
  {
    path: 'editor',
    component: BlockeditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'editor/:id',
    component: BlockeditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'callback',
    component: CallbackComponent
  },
  {
    path: 'docs',
    component: GroupDocOverviewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'notAuth',
    component: NotAuthComponent
  },
  {
    path: 'groups',
    component: GroupsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: StartComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
