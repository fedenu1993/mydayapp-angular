import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from 'src/app/entities/task';
import { TasksService } from 'src/app/services/tasks.service';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';

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

  titleControl: FormControl = new FormControl('');


  @HostListener('window:keydown.esc', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    this.escapeTask()
  }

  constructor(
    private tasksService: TasksService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {

    this.titleControl.setValue(this.dataTask.title);

    const ruta = this.route.snapshot.routeConfig?.path;
    if (ruta == 'completed') {
      this.activeRoute = this.dataTask.completed;
    } else if (ruta == 'pending') {
      this.activeRoute = !this.dataTask.completed;
    }

    this.editedTaskSubscription = this.tasksService.editedTask$.subscribe(e => {
      this.editing = e.edit
      if (e.edit) {
        setTimeout(() => {
          this.inputEdited.nativeElement.focus();
        }, 0);
      }
    })

  }

  async onCompleted(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.dataTask.completed = checkbox.checked;
    try {
      await this.tasksService.update(this.dataTask);
    } catch (error) {
      console.error("Error en onCompleted", error);
      throw error;
    }
  }

  async onDeleted(){
    await this.tasksService.delete([this.dataTask.id]);
  }

  onEdited() {
    this.tasksService.editingTask(this.dataTask.id, true);
  }

  async onKeyUp(event: KeyboardEvent) {
    let title = this.titleControl.value.trim();
    if (event.key == 'Enter' && title != '') {
      await this.saveTask(title)
    } else if (event.key == 'Escape') {
      this.escapeTask()
    }
  }

  async saveTask(title: string){
    this.dataTask.title = title;
    try {
      await this.tasksService.update(this.dataTask)
    } catch (error) {
      console.error("Error en onKeyUp Enter", error);
      throw error;
    }

    this.tasksService.editingTask('', false);
  }

  escapeTask(){
    this.titleControl.setValue(this.dataTask.title);
    this.tasksService.editingTask('', false);
  }

  ngOnDestroy(): void {
    this.editedTaskSubscription.unsubscribe();
  }

}
