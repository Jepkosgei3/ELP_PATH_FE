import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { User } from '../User';
import { HttpServiceService } from './http-service.service';
// import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  
  

  constructor(private http: HttpClient, private toast: ToastrService, private service:HttpServiceService) {   }

  private url = this.service.serverUrl;
  getRole(roleId: any): Observable<any>{
    const getRoleUrl = `${this.url}roles/${roleId}/view`;

    return this.http.get<any>(getRoleUrl)
  }

  getAllUsers(): Observable<any>{
    const getAllUsersUrl = `${this.url}users/view_all`;

    return this.http.get<any>(getAllUsersUrl)
  }

  countAllUsers(): Observable<any> {
    const countAllUsersUrl = `${this.url}users/count-all-users`;  

    console.log('All Users count', countAllUsersUrl)
    return this.http.get<any>(countAllUsersUrl);
  }

  countUsers(): Observable<any> {
    const countUsersUrl = `${this.url}users/count-users/`;  

    console.log('All Users count', countUsersUrl)
    return this.http.get<any>(countUsersUrl);
  }

  getAllAdmins(): Observable<any>{
    const getAllAdminsUrl = `${this.url}users/view-admins`;

    return this.http.get<any>(getAllAdminsUrl)
  }

  getAllRoles(): Observable<any>{
    const getAllRolesUrl = `${this.url}roles/all`;

    return this.http.get<any>(getAllRolesUrl)
  }


  //Create a new user
  createUser(url: string, data: any): Observable<any> {
    const createRoleUrl = `${this.url}users/create/user/${data.roleName}`;
   // console.log(data.roleName);
    // console.log(createRoleUrl);
    // console.log(data);
    const user: User = new User(data.firstName, data.lastName, data.username, data.userEmail, data.userPassword)
    console.log(user);
  
    return this.http.post<any>(createRoleUrl, user).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error:', error);
        this.toast.error("Error creating user");
        if (error.status === 500) {
          // Handle specific server-side error cases here
          // For example, display a custom message for non-unique results
          this.toast.error("User creation failed. Please check the provided data.");
        }
        throw error; // re-throw the error to propagate it to the subscriber
      })
    );
  }

  deactivateRole(roleId: any): Observable<any>{
    const deactivateRoleUrl = `${this.url}roles/${roleId}/delete`;

    return this.http.put<any>(deactivateRoleUrl, {})
  }

    updateRole(roleId: any, role: any): Observable<any>{
    const getAllinactiveRolesUrl = `${this.url}roles/${roleId}/update`;

    return this.http.put<any>(getAllinactiveRolesUrl, role)
  }
  
}
