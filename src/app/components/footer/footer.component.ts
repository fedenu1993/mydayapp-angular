import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Task } from 'src/app/entities/task';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, OnDestroy{

  tasks: Task[] = [];
  tasksPending: number = 0;
  tasksCompleted: number = 0;
  filters: {value: string, route: string}[] = [
    {value: 'All', route: '/'},
    {value: 'Pending', route: '/pending'},
    {value: 'Completed', route: '/completed'}
  ];
  tasksSubscription: Subscription = new Subscription();

  constructor(
    private tasksService: TasksService
  ) { }

  async ngOnInit() {
    await this.tasksService.list()
    this.tasksSubscription = this.tasksService.myTasks$.subscribe(e => {
      this.tasks = e;
      this.tasksPending = e.filter(e => !e.completed).length
      this.tasksCompleted = e.filter(e => e.completed).length
    })
  }

  deleteTasksCompleted(){
    const tasksCompleted = this.tasks.filter(e => e.completed).map(e => e.id)
    this.tasksService.delete(tasksCompleted);
  }

  ngOnDestroy(): void {
    this.tasksSubscription.unsubscribe();
  }

}
