import {
    Http,
    Headers,
    Response 
} from '@angular/http';

import { Injectable } from '@angular/core';
import 'rxjs/add/observable/from'
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable'

@Injectable()
export class ApiChatClinetService {
    constructor (private http:Http){

    }  

    
  get(url: string) {
    const headers = this.createCommonHeaders()

    // console.log(headers)

    return this.http.get(url, { headers })
  }

    post(url: string , data?: any){
        const headers = this.createCommonHeaders()

        return this.http.post(url,JSON.stringify(data),{headers});
    }
    
    
  private createCommonHeaders(): Headers {
    return new Headers({
      Accept: 'application/json',
      'Access-Control-Allow-Origin' : 'http://localhost:3000',
      'Access-Control-Allow-Methods':"*",
      'Content-Type': 'application/json'
    })
  }
  private mapResponse(response: any) {
    if (response.status !== 204) response.data = response.json()

    return response
  }

  private processErrorResponse(response: any) {
    if (response.status === 401 && response.url === -1) {
      // TODO Move this out of this class
      // console.debug('Http Error', response)
    } else {
      if (response.status !== 401) {
        // console.debug('Http Error', response)
      }
    }

    return Observable.throw(response)
  }
}