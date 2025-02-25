import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ServiceService } from 'src/app/services/service.service';
import { FormBuilder } from '@angular/forms';
import { faCircleDot } from '@fortawesome/free-solid-svg-icons';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AdminNewsUdateDeleteDialogComponent } from '../admin-news-udate-delete-dialog/admin-news-udate-delete-dialog.component';
import { AdminAddjobFormComponent } from '../admin-addjob-form/admin-addjob-form.component';
import { AdminAddJobUpdateComponent } from '../admin-add-job-update/admin-add-job-update.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-jobs',
  templateUrl: './admin-jobs.component.html',
  styleUrls: ['./admin-jobs.component.scss'],
})
export class AdminJobsComponent implements OnInit, AfterViewInit {

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['No', 'Title','howToApply','jobType',  'organization','Salary','eduLevel','Image','Action'];

 
  public faCircleDot = faCircleDot;

  formData = {
    title: '',
    content: '',
    image: null as File | null
  };


  sportLightData: any[] = [];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: ServiceService,
     private formbuilder: FormBuilder,
      public dialog: MatDialog,
      private snackBar:MatSnackBar) {}

  addJob() {
    // Open the dialog using the MatDialog service
    const dialogRef: MatDialogRef<AdminAddjobFormComponent> = this.dialog.open(AdminAddjobFormComponent, {
      width: '50%',
      data: { data: 'john' }
    });

    // Handle the dialog result (if needed)
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

 

  ngOnInit(): void {
    this.getJobs();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getJobs() {
    this.http.getJobOpportunities().subscribe(
      (data) => {
        this.dataSource.data = data.payload;

        console.log("Content",this.dataSource.data)
      }
    );
  }


  deleterRecord(recordId: Number ): void{
    const dialogRef = this.dialog.open(AdminNewsUdateDeleteDialogComponent);
    
    
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // User clicked 'Yes', proceed with deletion
        this.http.deleteJob(recordId).subscribe(() => {
          this.dataSource.data = this.dataSource.data.filter((item) => item.id !== recordId);
          console.log('Record deleted successfully.');
          this.snackBar.open('Feedback deleted successfully', 'Close', { duration: 2000 });
        });
      } else {
        // User clicked 'No', do nothing
        console.log('Deletion cancelled by the user.');
      }
    });
  }
  
  onSubmit() {
    this.http.postSpotlight(this.formData).subscribe(
      (res) => {
        console.log(res);
      }
    );
  }


  updateRecord(recordId: number): void {
    const newsItem = this.dataSource.data.find((item) => item.id === recordId);

    if (newsItem) {
      const dialogRef = this.dialog.open(AdminAddJobUpdateComponent, {
        width: '50%',//
        data: { id: recordId, ...newsItem },
      });

      dialogRef.afterClosed().subscribe((updatedData) => {
        if (updatedData) {
          console.log('Updated data:', updatedData);
          // Update the record directly in the table data source
          const index = this.dataSource.data.findIndex((item) => item.id === recordId);
          if (index !== -1) {
            this.dataSource.data[index] = updatedData;

            this.dataSource._updateChangeSubscription();
          }
        }
      });
    }
  }

  


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length) {
      this.formData.image = input.files[0];
    }
  }
}
