import { Component, OnInit } from '@angular/core';
import {BehaviorSubject, Subscription} from 'rxjs';
import { Article } from '../../article';
import { ArticleService } from '../../article.service';
import {Router} from '@angular/router';
import {GroupService} from '../../groups/group.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-doc-overview',
  templateUrl: './group-doc-overview.component.html',
  styleUrls: ['./group-doc-overview.component.css']
})
export class GroupDocOverviewComponent implements OnInit {

  articleSub: Subscription;
  articles: Article[];
  error: any;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
      public articleService: ArticleService,
      private router: Router,
      public groupService: GroupService,
      public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getGroupArticles();
  }

  openDialog(): void {
      const dialogRef = this.dialog.open(NewDocDialogComponent, {
          width: '30vw',
          panelClass: 'border-sharp'
      });

      dialogRef.afterClosed().subscribe(result => {
      });
  }

  getGroupArticles() {
      this.isLoading$.next(true);
      const group = this.groupService.currentGroupID;
      this.articleSub = this.articleService
        .getGroupArticles(group)
        .subscribe(
            articles => { this.articles = articles; },
            err => this.error = err,
            () => {
                this.isLoading$.next(false); }
        );
  }

  getInviteLink() {
    const groupID = this.groupService.currentGroupID;
    this.groupService.getInviteLink(groupID)
        .subscribe(resp => {
                            const selBox = document.createElement('textarea');
                            selBox.style.position = 'fixed';
                            selBox.style.left = '0';
                            selBox.style.top = '0';
                            selBox.style.opacity = '0';
                            selBox.value = resp.msg;
                            document.body.appendChild(selBox);
                            selBox.focus();
                            selBox.select();
                            document.execCommand('copy');
                            document.body.removeChild(selBox); });
  }


  loadChosenDocInEditor(artID, artTitle, artGroup) {
    const article = {articleID : artID, title : artTitle, group : artGroup};
    this.articleService.articleToLoad = article;
    this.articleService.newDocument = false;
    this.router.navigate(['/editor']);
  }
}

@Component({
    selector: 'app-new-doc-dialog',
    templateUrl: 'new-doc-dialog.html',
})
export class NewDocDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<NewDocDialogComponent>,
        public articleService: ArticleService,
        private router: Router
    ) {}

    onNoClick(): void {
        this.dialogRef.close();
    }

    createDocument() {
        const documentName = (document.getElementById('documentNameInput') as HTMLInputElement).value;
        this.articleService.newTitle = documentName;
        this.articleService.newDocument = true;
        this.dialogRef.close();
        this.router.navigate(['/editor']);
    }

}
