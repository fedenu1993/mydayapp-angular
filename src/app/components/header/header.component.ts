import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Task } from 'src/app/entities/task';
import { TasksService } from 'src/app/services/tasks.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit, OnDestroy{

  task: Task = new Task();
  @ViewChild('inputCreate') inputCreate!: ElementRef;
  editedTaskSubscription: Subscription = new Subscription();

  constructor(
    private tasksService: TasksService
  ){
  }

  ngAfterViewInit(): void {
    this.editedTaskSubscription = this.tasksService.editedTask$.subscribe(e => {
      if(!e.edit){
        this.inputCreate.nativeElement.focus()
      }
    });
  }

  onEnter(event: any): void {
    const keyboardEvent = event as KeyboardEvent;
    let inputElement = keyboardEvent.target as HTMLInputElement;
    let input = inputElement.value.trim();
    if(input != ''){
      this.task.title = input;
      this.tasksService.create(this.task);
      this.task = new Task()
      inputElement.value = '';
    }
  }

  ngOnDestroy(): void {
    this.editedTaskSubscription.unsubscribe();
  }

}
