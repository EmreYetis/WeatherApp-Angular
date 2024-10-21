import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = environment.openWeatherApiKey;
  private apiUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(private http: HttpClient) { }

  getCurrentWeather(city: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/weather?q=${city}&appid=${this.apiKey}&units=metric`);
  }

  getWeatherForecast(city: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/forecast?q=${city}&appid=${this.apiKey}&units=metric`);
  }
}
