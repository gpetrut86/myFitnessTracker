import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'
import { TrainingService } from '../training.service';
import { StopTrainingComponent } from './stop-training.component';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {


  progress: number = 0;
  timmer;
  constructor(private dialog: MatDialog, private trainingService: TrainingService) { }

  ngOnInit(): void {
    this.startOrResumeTimmer();
  }

  startOrResumeTimmer(): void {
    const step = this.trainingService.getRunningExercises().duration / 100 * 1000;

    this.timmer = setInterval(() => {
      this.progress = this.progress + 1;

      if (this.progress >= 100) {
        this.trainingService.completeExercise();
        clearInterval(this.timmer);
      }
    }, step);
  }

  onStop() {
    clearInterval(this.timmer);
    const dialogRef = this.dialog.open(StopTrainingComponent,
      {
        data: {
          progress: this.progress
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.trainingService.cancelExercise(this.progress)
      } else {
        this.startOrResumeTimmer();
      }
    })
  }

}
