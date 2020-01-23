import { Subject } from 'rxjs';
import { ajaxResponse } from '../ajax/ajax';

export interface ToastMessage {
  message: string,
  duration: number,
  key?: number,
}

export class ToastService {

  public messages$ = new Subject<ToastMessage>();

  showMessage(message: string, milliseconds: number = 1000) {
    this.messages$.next({message, duration:milliseconds});
  }

  //TODO: for now only prints the first error
  printServerErrors (res:ajaxResponse) {
    const errors = res.errors || [];
    if(errors.length > 0){
      this.showMessage(errors[0].msg);
    }
  }



}
export const toastService = new ToastService();


