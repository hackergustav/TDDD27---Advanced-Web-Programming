import {Component, OnInit} from '@angular/core';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import SimpleImage from '@editorjs/simple-image';
import Embed from '@editorjs/embed';
import Checklist from '@editorjs/checklist';
import Marker from '@editorjs/marker';
import {ArticleService} from '../article.service';
import {Article} from '../article';
import {GroupService} from '../groups/group.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {BehaviorSubject, Subscription} from 'rxjs';
import {Router} from '@angular/router';

let globalRouter: Router;
let globalArticleService;

class LinkTool {
  data;

  static get toolbox() {
    return {};
  }

  constructor(data) {
    this.data = data.data;
  }

  render() {
    const wrapper = document.createElement('div');
    const input = document.createElement('a');

    input.textContent = this.data.title;
    input.style.color = 'blue';

    input.onclick = () => {
      globalArticleService.articleToLoad.articleID = this.data.url;
      globalArticleService.articleToLoad.title = this.data.title;
      globalArticleService.newDocument = false;
      globalRouter.navigate(['/editor/' + this.data.url]);
    };

    wrapper.appendChild(input);

    return wrapper;
  }

  save() {

    return {
      url: this.data.url,
      title: this.data.title
    };
  }

  validate(savedData) {
    if (!savedData.url.trim()) {
      return false;
    }

    return true;
  }
}

@Component({
  selector: 'app-blockedit',
  templateUrl: './blockedit.component.html',
  styleUrls: ['./blockedit.component.css']
})
export class BlockeditComponent implements OnInit {

  public editor;
  error: any;
  selectedGroupID = null;
  selectedGroupName = null;
  lastChange: number = (new Date()).getTime();
  timeoutID: number;
  title: string;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(public articleService: ArticleService,
              public groupService: GroupService,
              public dialog: MatDialog,
              public router: Router) {

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    globalRouter = this.router;
    globalArticleService = this.articleService;

    this.lastChange = 0;
    this.timeoutID = null;

    this.editor = new EditorJS({
      holderId : 'editor-js',

      tools: {
        header: {
          class: Header,
          inlineToolbar: ['link']
        },
        list: {
          class: List,
          inlineToolbar: true
        },
        checklist: {
          class: Checklist,
          inlineToolbar: true,
        },
        // Tool for inputting images by pasting the image-URL into the editor
        simpleImage: {
          class: SimpleImage,
          inlineToolbar: true
        },
        // Tool making it possible to embed youtube-videos and coub-loops in the document
        embed: {
          class: Embed,
          inlineToolbar: false,
          config: {
            services: {
              youtube: true,
              coub: true
            }
          }
        },
        marker: {
          class: Marker
        },
        // Custom tool for linking between documents in the application
        links: {
          class: LinkTool,
          inlineToolbar: false
        }
      },

      onReady: () => {
        this.initializeArticle();
      },

// This code detects changes in the document and saves the changes to the server
// after 5 seconds have elapsed with no additional changes.
      onChange: () => {
        const now = (new Date()).getTime();
        if (now - this.lastChange < 5000) {
          if (this.timeoutID) {
            clearTimeout(this.timeoutID);
          }
          this.timeoutID = setTimeout(() => {
            this.saveArticle();
          }, 5000);
        }

        this.lastChange = now;
      }
    });
  }


  ngOnInit() {
    this.selectedGroupID = this.groupService.currentGroupID;
    this.selectedGroupName = this.groupService.currentGroupName;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LinkDialogComponent, {
      width: '30vw',
      panelClass: 'border-sharp',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.addLinkToDocument(result);
    });
  }

  addLinkToDocument(result: any) {
    const block = {type: 'links', data: {url: result.data.id.toString(), title: result.data.title}};
    this.editor.blocks.insert(block.type, block.data);
  }

  initializeArticle() {
    this.isLoading$.next(true);
    if (!this.articleService.newDocument) {
      this.articleService
          .getArticleToBeLoaded()
          .subscribe(
              result => {
                const loadedArticle = JSON.parse(result.content);
                this.editor.render(loadedArticle);
              },
              error => console.log(error.message),
              () => {
                this.isLoading$.next(false); }
          );
      this.title = this.articleService.articleToLoad.title;
      this.selectedGroupID = this.articleService.articleToLoad.group;
    } else if (this.articleService.newDocument) {
      this.title = this.articleService.newTitle;
      this.saveArticle();
    }
    this.isLoading$.next(false);
  }

  saveArticle() {
    this.editor.save().then((outputData) => {
      let savedData;
      const article = new Article();
      savedData = outputData;

      article.content = JSON.stringify(savedData);
      article.title = this.title;
      article.group = this.selectedGroupID;
      if (article.title === '' || article.group == null ) {
        alert('Please fill out all fields');
      } else {
        this.articleService
            .saveArticle(article)
            .subscribe(
                result => console.log(result),
                error => alert(error.message)
            );
      }

    }).catch((error) => {
      console.log('Saving failed: ', error);
    });
  }

  clearArticle() {
    this.editor.clear();
  }

  deleteDocument() {
    this.articleService
        .deleteDocument()
        .subscribe(
            result => {console.log(result)
                       this.router.navigate(['/docs']); },
            error => console.log(error.message)
        );
  }
}

@Component({
  selector: 'app-link-dialog',
  templateUrl: 'link-dialog.component.html',
})
export class LinkDialogComponent implements OnInit {

  articleSub: Subscription;
  articles: Article[];
  error: any;

  constructor(
      public groupService: GroupService,
      public articleService: ArticleService,
      public dialogRef: MatDialogRef<LinkDialogComponent>) {}

  ngOnInit() {
    this.getGroupArticles();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getGroupArticles() {
    const group = this.groupService.currentGroupID;
    this.articleSub = this.articleService
        .getGroupArticles(group)
        .subscribe(
            articles => { this.articles = articles; },
            err => this.error = err
        );
  }

  getLink(id: number, title: string) {
    const data = {id, title};
    this.dialogRef.close({ data });
  }

}
