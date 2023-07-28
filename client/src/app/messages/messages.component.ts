import { Component, OnInit } from '@angular/core';
import { Pagination } from '../_modules/pagination';
import { Message } from '../_models/message';
import { MessagesService } from '../_services/messages.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages?: Message[];
  pagination?: Pagination;
  container = 'Unread';
  pageNumber = 1;
  pageSize = 5;
  loading = false;


  constructor(private messageService: MessagesService) { }


  ngOnInit(): void {
    this.loadMessages();


  }


  loadMessages() {
    this.loading=true;
    this.messageService.getMessages(this.pageNumber,this.pageSize,this.container).subscribe({
      next:response =>{
        this.messages=response.result;        
        this.pagination =response.pagination;
        this.loading=false;
      }
    })
  }

  
  // loadMessages() {
  //   this.loading = true;
  //   this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe(res => {
  //     this.messages = res.result
  //     this.loading = false;
  //     this.pagination=res.pagination;
  //   })
  // } 

  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe({
      next: () => this.messages?.splice(this.messages.findIndex(m => m.id == id), 1)
    })
  }

  pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadMessages();
    }
  }

}