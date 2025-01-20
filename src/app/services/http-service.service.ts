import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private serverUrl = 'http://52.40.34.128:8081/';

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error.message);
    return throwError(() => new Error(error.message || 'Server Error'));
  }

  getData(url: string): Observable<any> {
    return this.http
      .get(url, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(catchError(this.handleError));
  }

  fetchUserDataById(id: number): Observable<any> {
    const url = `${this.serverUrl}scholars/display-scholars/${id}`;
    return this.http.get<any>(url).pipe(catchError(this.handleError));
  }

  getFilteredData(url: string, filters: Record<string, any>): Observable<any> {
    let params = new HttpParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== null && filters[key] !== '') {
        params = params.append(key, filters[key]);
      }
    });
    return this.http.get<any>(url, { params }).pipe(catchError(this.handleError));
  }

  downloadReport(url: string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' }).pipe(catchError(this.handleError));
  }

  getUsers(userId: number): Observable<any> {
    const url = `${this.serverUrl}profile/get-user-data/${userId}`;
    return this.http.get<any>(url).pipe(catchError(this.handleError));
  }

  setHubAdmin(hubId: number, userId: number): Observable<any> {
    const url = `${this.serverUrl}v2/hubs/v2/set-hub-admin/${hubId}/${userId}`;
    return this.http.put<any>(url, '').pipe(catchError(this.handleError));
  }

  getHubMembers(hubId: number): Observable<any> {
    const url = `${this.serverUrl}v2/hubs/${hubId}/display-hub-members`;
    return this.http.get<any>(url).pipe(catchError(this.handleError));
  }

  getUserNotifications(userId: string): Observable<any> {
    const url = `${this.serverUrl}notifications/get-user-notification/${userId}`;
    return this.http.get<any>(url).pipe(catchError(this.handleError));
  }

  postData(url: string, data: any): Observable<any> {
    return this.http.post(url, data, { headers: { 'Content-Type': 'application/json' } }).pipe(catchError(this.handleError));
  }

  postSkill(data: any, userId: number): Observable<any> {
    const url = `${this.serverUrl}skills/create/${userId}`;
    return this.http.post<any>(url, data).pipe(catchError(this.handleError));
  }

  postSocial(data: any, userId: number): Observable<any> {
    const url = `${this.serverUrl}socials/${userId}/add`;
    return this.http.post<any>(url, data).pipe(catchError(this.handleError));
  }

  editSocials(userId: number, data: any): Observable<any> {
    const url = `${this.serverUrl}socials/${userId}/update`;
    return this.http.put<any>(url, data).pipe(catchError(this.handleError));
  }

  deleteCareer(id: number, userId: string): Observable<any> {
    const url = `${this.serverUrl}career/${id}/${userId}/delete`;
    return this.http.delete<any>(url).pipe(catchError(this.handleError));
  }

  deleteEvent(eventId: number): Observable<any> {
    const url = `${this.serverUrl}v2/events/${eventId}/delete`;
    return this.http.delete<any>(url).pipe(catchError(this.handleError));
  }

  deleteSkill(skillId: number, userId: number): Observable<any> {
    const url = `${this.serverUrl}skills/delete/${userId}/${skillId}`;
    return this.http.delete<any>(url).pipe(catchError(this.handleError));
  }

  deleteUser(userId: number): Observable<any> {
    const url = `${this.serverUrl}/users/${userId}/delete`;
    return this.http.delete<any>(url).pipe(catchError(this.handleError));
  }

  postScholarDataForVerification(data: any): Observable<any> {
    const url = `${this.serverUrl}join-request/alumni/verify-details`;
    return this.http.post<any>(url, data).pipe(catchError(this.handleError));
  }

  deleteFeed(userId: number, feedId: number): Observable<any> {
    const url = `${this.serverUrl}v2/feeds/${userId}/${feedId}/delete`;
    return this.http.delete<any>(url).pipe(catchError(this.handleError));
  }

  editFeed(feedId: number, userId: number, data: any): Observable<any> {
    const url = `${this.serverUrl}v2/feeds/${userId}/${feedId}/edit`;
    return this.http.put<any>(url, data, { headers: { 'Content-Type': 'application/json' } }).pipe(catchError(this.handleError));
  }

  postLikeFeed(userId: number, feedId: number): Observable<any> {
    const url = `${this.serverUrl}like/add/${userId}/${feedId}?userId=${userId}`;
    return this.http.post<any>(url, null).pipe(catchError(this.handleError));
  }

  postLikeCount(feedId: number): Observable<any> {
    const url = `${this.serverUrl}like/all/${feedId}`;
    return this.http.get<any>(url).pipe(catchError(this.handleError));
  }

  postFeedComment(feedId: number, userId: number, comment: any): Observable<any> {
    const url = `${this.serverUrl}comments/add/${userId}/${feedId}`;
    return this.http.post<any>(url, comment, { headers: { 'Content-Type': 'application/json' } }).pipe(catchError(this.handleError));
  }

  getFeedComments(feedId: number): Observable<any> {
    const url = `${this.serverUrl}comments/all/${feedId}`;
    return this.http.get<any>(url).pipe(catchError(this.handleError));
  }

  getPaginatedData(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString());
    return this.http.get<any>(this.serverUrl, { params }).pipe(catchError(this.handleError));
  }

  getSkills(userId: number): Observable<any> {
    const url = `${this.serverUrl}skills/get/${userId}`;
    return this.http.get<any>(url).pipe(catchError(this.handleError));
  }

  getScholarsByType(type: string): Observable<any> {
    const url = `${this.serverUrl}scholars/${type}/scholars-view`;
    return this.http.get<any>(url).pipe(catchError(this.handleError));
  }
}

