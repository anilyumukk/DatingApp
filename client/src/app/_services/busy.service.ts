import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  busyRequestCount = 0;

  constructor(private spinnerService:NgxSpinnerService) { }

  busy(){
    this.busyRequestCount++;
    this.spinnerService.show(undefined,{
      type:'line-scale-party',
      bdColor:'rgba(220.150,70,15)',
      color:'#333333'

    })
  }

  idle(){
    this.busyRequestCount--;
    if(this.busyRequestCount <=0){
      this.busyRequestCount=0;
      this.spinnerService.hide();
    }

  }
}
