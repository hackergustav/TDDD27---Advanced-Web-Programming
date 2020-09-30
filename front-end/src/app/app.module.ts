import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import {BlockeditComponent, LinkDialogComponent} from './blockedit/blockedit.component';
import { CallbackComponent } from './callback.component';
import { ArticleService } from './article.service';
import { AuthService } from './auth/auth.service';
import { AuthGuardService } from './auth/auth-guard.service';
import { NotAuthComponent } from './not-auth/not-auth.component';
import { DialogComponent, GroupsComponent } from './groups/groups.component';
import { GroupDocOverviewComponent, NewDocDialogComponent } from './documents/group-doc-overview/group-doc-overview.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { StartComponent } from './start/start.component';

@NgModule({
    declarations: [
        AppComponent,
        BlockeditComponent,
        CallbackComponent,
        NotAuthComponent,
        GroupsComponent,
        GroupDocOverviewComponent,
        MainNavComponent,
        StartComponent,
        DialogComponent,
        LinkDialogComponent,
        NewDocDialogComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        BrowserAnimationsModule,
        MaterialModule,
        LayoutModule,
    ],

    entryComponents: [
        DialogComponent,
        LinkDialogComponent,
        NewDocDialogComponent
    ],
    providers: [
        ArticleService,
        AuthService,
        AuthGuardService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
