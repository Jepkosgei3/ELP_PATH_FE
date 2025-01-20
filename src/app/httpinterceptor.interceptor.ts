import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpinterceptorInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Retrieve the user data from local storage.
    const userData = localStorage.getItem('userData');

    // Check if userData exists and parse it safely.
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        const authToken = parsedData.token;

        if (authToken) {
          // Clone the request to add the authorization header.
          const authRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          return next.handle(authRequest);
        }
      } catch (error) {
        console.error('Error parsing userData from localStorage:', error);
      }
    }

    // Pass through the original request if no auth token is found.
    return next.handle(request);
  }
}
