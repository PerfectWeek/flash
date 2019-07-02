export class User {
  email: string;
  timeSlots: any[];

  public constructor(email: string, timeSlots: any[]) {
    this.email = email;
    this.timeSlots = timeSlots;
  }
}
