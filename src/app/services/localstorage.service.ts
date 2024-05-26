import { Injectable } from '@angular/core';
import { Task } from '../entities/task';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

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
  }
  
}
