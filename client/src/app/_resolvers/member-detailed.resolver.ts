import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { MembersService } from '../_services/members.service';
import { Member } from '../_models/member';

@Injectable({
  providedIn:'root'
})
export class memberDetailedResolver implements Resolve<Member>{

  constructor(private memberService:MembersService) { }
 resolve(route:ActivatedRouteSnapshot): Observable<Member> {
  
 return this.memberService.getMember(route.paramMap.get('username')!)
 }
};
