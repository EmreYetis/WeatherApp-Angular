import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { WeatherService } from './weather.service';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
}

interface ForecastData {
  list: Array<{
    dt_txt: string;
    main: {
      temp: number;
    };
    weather: Array<{
      description: string;
      icon: string;
    }>;
  }>;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [DatePipe, WeatherService]
})
export class AppComponent implements OnInit {
  currentWeather: WeatherData | null = null;
  forecast: ForecastData | null = null;
  fiveDayForecast: any[] = [];
  city: string = 'Istanbul';

  constructor(private datePipe: DatePipe, private weatherService: WeatherService) {}

  ngOnInit() {
    this.getWeatherData();
  }

  getWeatherData() {
    this.weatherService.getCurrentWeather(this.city).subscribe(
      (data: WeatherData) => {
        this.currentWeather = data;
      },
      (error) => {
        console.error('Güncel hava durumu verileri alınamadı', error);
      }
    );

    this.weatherService.getWeatherForecast(this.city).subscribe(
      (data: ForecastData) => {
        this.forecast = data;
        this.processFiveDayForecast();
      },
      (error) => {
        console.error('Hava durumu tahmini verileri alınamadı', error);
      }
    );
  }

  processFiveDayForecast() {
    if (this.forecast && this.forecast.list) {
      const uniqueDays = new Set<string>();
      this.fiveDayForecast = this.forecast.list.filter(item => {
        const date = this.formatDate(item.dt_txt, 'dd/MM');
        if (!uniqueDays.has(date) && uniqueDays.size < 5) {
          uniqueDays.add(date);
          return true;
        }
        return false;
      });
    }
  }

  onSearch() {
    this.getWeatherData();
  }

  formatDate(date: string, format: string): string {
    const formattedDate = this.datePipe.transform(date, format);
    if (format === 'EEEE') {
      const turkishDays = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
      const dayIndex = new Date(date).getDay();
      return turkishDays[dayIndex];
    }
    return formattedDate || '';
  }

  translateWeatherDescription(description: string): string {
    const translations: { [key: string]: string } = {
      'clear sky': 'Açık hava',
      'few clouds': 'Az bulutlu',
      'scattered clouds': 'Parçalı bulutlu',
      'broken clouds': 'Çok bulutlu',
      'shower rain': 'Sağanak yağışlı',
      'rain': 'Yağmurlu',
      'thunderstorm': 'Gök gürültülü fırtına',
      'snow': 'Karlı',
      'mist': 'Sisli',
      'overcast clouds': 'Kapalı bulutlu',
      'light rain': 'Hafif yağmurlu',
      'moderate rain': 'Orta şiddetli yağmurlu',
      'heavy intensity rain': 'Şiddetli yağmurlu',
      'very heavy rain': 'Çok şiddetli yağmurlu',
      'extreme rain': 'Aşırı yağmurlu',
      'freezing rain': 'Dondurucu yağmurlu',
      'light intensity shower rain': 'Hafif sağanak yağışlı',
      'heavy intensity shower rain': 'Şiddetli sağanak yağışlı',
      'ragged shower rain': 'Düzensiz sağanak yağışlı',
      // Daha fazla çeviri ekleyebilirsiniz...
    };

    return translations[description.toLowerCase()] || description;
  }
}
