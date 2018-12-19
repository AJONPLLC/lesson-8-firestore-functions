import {Review} from '@ajonp-models/review';
import { Observable } from 'rxjs';

export class Book {
  constructor(
    public id?: string,
    public title?: string,
    public author?: string,
    public description?: string,
    public topReview?: any,
    public topReview$?: Observable<Review>,
    public rating?: number,
    public imageURL?: string,
    public likes?: any,
    public likes_count?: number
    ) {

  }
}
