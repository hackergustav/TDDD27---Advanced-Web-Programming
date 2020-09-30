import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Article } from './article';
import {AuthService} from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private getArticlesURL = 'http://localhost:5000/articles';
  public articleToLoad;
  public newDocument = true;
  public newTitle: string;

  constructor(private http: HttpClient, public authService: AuthService) {}

  getArticleToBeLoaded(): Observable<any> {
    if (!this.newDocument) {
      this.newDocument = true;
      return this.http
          .get<Article[]>(`${this.getArticlesURL}/${this.articleToLoad.articleID}`, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.accessToken}`)
          })
          .pipe(catchError(this.handleError));
    }
  }

  deleteDocument(): Observable<any> {
    return this.http
        .get(`${this.getArticlesURL}/remove/${this.articleToLoad.articleID}`, {
          headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.accessToken}`)
        })
        .pipe(catchError(this.handleError));
  }

  private handleError(err: HttpErrorResponse | any) {
    console.error('An error occurred', err);
    return throwError(err.message || err);
  }

  saveArticle(article: Article): Observable<any> {
    if (this.authService.authenticated) {
      return this.http
          .post(`${this.getArticlesURL}`, article, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.accessToken}`)
          }).pipe(catchError(this.handleError));
    } else {
      alert('Unauthorized');
    }
  }

  getGroupArticles(group: string) {
    return this.http
        .get<Article[]>(`${this.getArticlesURL}/group=${group}`, {
          headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.accessToken}`)
        })
        .pipe(catchError(this.handleError));
  }
}
