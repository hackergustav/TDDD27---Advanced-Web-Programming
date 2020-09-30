import { Component, OnInit } from '@angular/core';
import {BehaviorSubject, Subscription} from 'rxjs';
import {GroupService} from './group.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  groupSub: Subscription;
  groups;
  error: any;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(public groupService: GroupService, public dialog: MatDialog) { }

  ngOnInit() {
      this.getMyGroups();
  }

    openDialog(): void {
        const dialogRef = this.dialog.open(DialogComponent, {
            width: '30vw',
            panelClass: 'border-sharp'
        });

        dialogRef.afterClosed().subscribe(result => {
            this.getMyGroups();
        });
    }

  getMyGroups() {
    this.isLoading$.next(true);
    this.groupSub = this.groupService
        .getMyGroups()
        .subscribe(
            groups => {this.groups = groups; },
            err => this.error = err,
            () => {
              this.isLoading$.next(false); }
        );
  }

    setCurrentGroup(id: string, name: string) {
        this.groupService.currentGroupID = id;
        this.groupService.currentGroupName = name;

    }
}


@Component({
    selector: 'app-dialog-overview-example-dialog',
    templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogComponent {

    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(
        public groupService: GroupService,
        public dialogRef: MatDialogRef<DialogComponent>) {}

    onNoClick(): void {
        this.dialogRef.close();
    }

    createGroup() {
        this.isLoading$.next(true);
        const groupName = (document.getElementById('groupNameInput') as HTMLInputElement).value;
        const groupDesc = (document.getElementById('groupDescInput') as HTMLInputElement).value;
        this.groupService
            .createGroup(groupName, groupDesc)
            .subscribe(
                result => { this.dialogRef.close(); },
                error => alert(error.message + ' An error occured when creating new group'),
                () => {
                    this.isLoading$.next(false); }
            );
    }

    joinGroup() {
        this.isLoading$.next(true);
        const link = (document.getElementById('groupLinkInput') as HTMLInputElement).value;
        this.groupService
            .joinGroup(link)
            .subscribe(
                result => { this.dialogRef.close(); },
                error => alert(error.message + ' Error joinGroup'),
                () => {
                    this.isLoading$.next(false); }
            );
    }
}
