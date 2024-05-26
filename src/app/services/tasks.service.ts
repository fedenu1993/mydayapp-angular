import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../entities/task';
import { ActivatedRoute } from '@angular/router';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private myTasks = new BehaviorSubject<Task[]>([]);
  myTasks$ = this.myTasks.asObservable();

  editedTask = new BehaviorSubject<editTaskObservable>({id: '', edit: false});
  editedTask$ = this.editedTask.asObservable();

  routeFilter: string = '';

  constructor(
    private route: ActivatedRoute,
    private localstorageService: LocalstorageService
  ){
    this.routeFilter = this.route.snapshot.routeConfig?.path ?? '';
  }

  setTasks(tasks: Task[]){
    this.localstorageService.setTasks(tasks)
    this.myTasks.next(tasks);
  }

  async list() {
    try {
      const tasks = await this.localstorageService.getTasks();
      let tasksWithFilters = tasks;
      // const ruta = this.route.snapshot.routeConfig?.path;
      if(this.routeFilter == 'completed'){
        tasksWithFilters = tasksWithFilters.filter((t: Task) => t.completed);
      }else if(this.routeFilter == 'pending'){
        tasksWithFilters = tasksWithFilters.filter((t: Task) => !t.completed);
      }
      this.myTasks.next(tasksWithFilters);
    } catch (error) {
      console.error("Error al obtener registros", error);
      throw error;
    }
  }

  async create(task: Task) {
    try {
      const tasks: Task[] = await this.localstorageService.getTasks();
      let newIdTask = "1";
      if(tasks.length > 0){
        newIdTask = (parseInt(tasks.sort((a, b) => parseInt(a.id) - parseInt(b.id))[tasks.length - 1].id) + 1).toString();
      }
      task.id = newIdTask;
      tasks.push(task)
      this.setTasks(tasks);
    } catch (error) {
      console.error("Error al obtener registros", error);
      throw error;
    }
  }

  async delete(id: string[]) {
    try {
      let tasks: Task[] = await this.localstorageService.getTasks();
      tasks = tasks.filter(e => !id.includes(e.id))
      this.setTasks(tasks);
    } catch (error) {
      console.error("Error al eliminar registro", error);
      throw error;
    }
  }

  async update(task: Task) {
    try {
      let tasks: Task[] = await this.localstorageService.getTasks();
      let index = tasks.findIndex(t => t.id == task.id);
      if (index !== -1) {
        tasks[index] = task;
        this.setTasks(tasks);
      }
    } catch (error) {
      console.error("Error al editar registro", error);
      throw error;
    }
  }

  editingTask(id: string, edit: boolean){
    this.editedTask.next({
      id: id,
      edit: edit
    });
    if(!edit){
      this.list()
    }
  }

}

interface editTaskObservable{
  id: string;
  edit: boolean; 
}