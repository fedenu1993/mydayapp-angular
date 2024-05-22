import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../entities/task';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private myTasks = new BehaviorSubject<Task[]>([]);
  myTasks$ = this.myTasks.asObservable();

  editedTask = new BehaviorSubject<editTaskObservable>({id: '', edit: false});
  editedTask$ = this.editedTask.asObservable();

  async getTasks() {
    const tasksStorage = localStorage.getItem('mydayapp-angular');
    let array = [];
    if (tasksStorage) {
      array = await JSON.parse(tasksStorage);
    }
    return array;
  }

  setTasks(tasks: Task[]) {
    localStorage.setItem('mydayapp-angular', JSON.stringify(tasks));
    this.myTasks.next(tasks);
  }

  async list() {
    try {
      const tasks = await this.getTasks();
      this.myTasks.next(tasks);
    } catch (error) {
      console.error("Error al obtener registros", error);
      throw error;
    }
  }

  async create(task: Task) {
    try {
      const tasks: Task[] = await this.getTasks();
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
      let tasks: Task[] = await this.getTasks();
      tasks = tasks.filter(e => !id.includes(e.id))
      this.setTasks(tasks);
    } catch (error) {
      console.error("Error al eliminar registro", error);
      throw error;
    }
  }

  async update(task: Task) {
    try {
      let tasks: Task[] = await this.getTasks();
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