import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  currentGroupID = null;
  currentGroupName = null;

  constructor(private http: HttpClient, public authService: AuthService) { }

  // Retrieves the groups that the current user is a member of
  getMyGroups() {
    if (this.authService.authenticated) {
      return this.http
          .get(`${'http://localhost:5000/get_my_groups'}`, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.accessToken}`)
          });
    } else {
      alert('Unauthorized');
    }
  }

  private handleError(err: HttpErrorResponse | any) {
    console.error('An error occurred', err);
    return throwError(err.message || err);
  }

  createGroup(groupName: string, groupDesc: string): Observable<any> {

    const groupNameJSON = { group_name: groupName, group_desc: groupDesc, user: this.authService.userProfile.sub.substring(6)};

    if (this.authService.authenticated) {
      const resp =  this.http
          .post(`${'http://localhost:5000/create_group'}`, groupNameJSON, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.accessToken}`)
          });
      return resp;
    } else {
      alert('Unauthorized');
    }
  }

  getInviteLink(groupID: string): Observable<any> {

    const groupNameJSON = { group: groupID};

    if (this.authService.authenticated) {
      const resp =  this.http
          .post(`${'http://localhost:5000/generate_invite'}`, groupNameJSON, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.accessToken}`)
          });
      return resp;
    } else {
      alert('Unauthorized');
    }
  }

  joinGroup(link: string): Observable<any> {
    if (this.authService.authenticated) {
      const resp =  this.http
          .post(`${'http://localhost:5000/invite'}/${link}`, link, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.accessToken}`)
          });
      return resp;
    } else {
      alert('Unauthorized');
    }
  }
}
