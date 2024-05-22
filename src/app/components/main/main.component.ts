import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Task } from 'src/app/entities/task';
import { TasksService } from 'src/app/services/tasks.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy{

  @Input() tasksMain: Task[] = [];
  editedTaskSubscription: Subscription = new Subscription();

  constructor(
    private tasksService: TasksService
  ){}

  async ngOnInit() {
    this.tasksService.editedTask$.subscribe(async e => {
      // En caso de editar una tarea se muestra solamente esa
      if(e.id != ''){
        this.tasksMain = this.tasksMain.filter(t => t.id == e.id);
      }
    })
  }

  ngOnDestroy(): void {
    this.editedTaskSubscription.unsubscribe();
  }

}
