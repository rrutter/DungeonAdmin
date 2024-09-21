import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  private apiUrl = 'http://localhost:8080/api/equipment';  // Pointing to the Spring Boot API

  constructor(private http: HttpClient) { }

  createEquipment(equipmentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, equipmentData);
  }
}
