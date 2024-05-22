import { Component, OnDestroy, OnInit } from '@angular/core';
import { TasksService } from 'src/app/services/tasks.service';
import { Task } from 'src/app/entities/task';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {

  tasks: Task[] = [];
  existTasks: boolean = false;
  tasksSubscription: Subscription = new Subscription();

  constructor(
    private tasksService: TasksService,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    // Obtengo las tareas y me subscribo a sus cambios
    await this.tasksService.list()
    this.tasksSubscription = this.tasksService.myTasks$.subscribe(e => {
      this.existTasks = e.length > 0;
      const ruta = this.route.snapshot.routeConfig?.path;
      if(ruta == 'completed'){
        e = e.filter(t => t.completed);
      }else if(ruta == 'pending'){
        e = e.filter(t => !t.completed);
      }
      this.tasks = e
    })

  }

  ngOnDestroy(): void {
    this.tasksSubscription.unsubscribe();
  }


}
