import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from 'src/app/entities/task';
import { TasksService } from 'src/app/services/tasks.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit, OnDestroy {

  @Input() dataTask: Task = new Task();
  editing: boolean = false;
  @ViewChild('inputEdited') inputEdited!: ElementRef;
  activeRoute: boolean = true;
  editedTaskSubscription: Subscription = new Subscription();

  constructor(
    private tasksService: TasksService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.editedTaskSubscription = this.tasksService.editedTask$.subscribe(e => {
      this.editing = e.edit
      if (e.edit) {
        setTimeout(() => {
          this.inputEdited.nativeElement.focus();
        }, 0);
      }
    })
    const ruta = this.route.snapshot.routeConfig?.path;
    if(ruta == 'completed'){
      this.activeRoute = this.dataTask.completed;
    }else if(ruta == 'pending'){
      this.activeRoute = !this.dataTask.completed;
    }
  }

  async onCompleted(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.dataTask.completed = checkbox.checked;
    await this.tasksService.update(this.dataTask);
  }

  onEdited() {
    this.tasksService.editingTask(this.dataTask.id, true);
  }

  async onKeyUp(event: KeyboardEvent, input: HTMLInputElement) {
    if (event.key == 'Enter') {
      this.dataTask.title = input.value.trim();
      await this.tasksService.update(this.dataTask)
      this.tasksService.editingTask('', false);
    } else if (event.key == 'Escape') {
      this.tasksService.editingTask('', false);
    }
  }

  ngOnDestroy(): void {
    this.editedTaskSubscription.unsubscribe();
  }

}
