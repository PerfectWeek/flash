export class User {
  name: string;
  picture: string;
  timeSlots: any[];

  public constructor(name: string, picture:string, timeSlots: any[]) {
    this.name = name;
    this.picture = picture;
    this.timeSlots = timeSlots;
  }
}
