import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

///
@Injectable()
export class HttpinterceptorInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Log the availability of localStorage
    if (typeof localStorage === 'undefined') {
      console.error('localStorage is not available in this environment.');
      return next.handle(request);
    }

    console.log('localStorage is available.');

    // Log all the content inside localStorage
    console.log('Current localStorage contents:', { ...localStorage });
    // Retrieve the authorization token from wherever you store it (e.g., local storage, state management).
    const userData = localStorage.getItem('userData');
    let authToken = '';
    if (userData) {
      const parseData = JSON.parse(userData);
      const authToken = parseData.token;

      // Clone the request and add the authorization header.
      const authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      // Pass the modified request to the next interceptor or the HTTP client.
      return next.handle(authRequest);
    } else {
      return next.handle(request);
    }
    return next.handle(request);
  }
}
