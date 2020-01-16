
import { BehaviorSubject } from 'rxjs';



export class LoadingService {
  private _loading: boolean = false;
  

  public loading$ = new BehaviorSubject(this._loading);

  startLoading() {
    this.loading = true;
  }

  stopLoading() {
    this.loading = false;
  }

  public get loading(): boolean {
    return this._loading;
  }
  public set loading(value: boolean) {
    this._loading = value;
    this.loading$.next(value);
  }

  startLoadingTimer() {

  }

}
export const loadingService = new LoadingService();


