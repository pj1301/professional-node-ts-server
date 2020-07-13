export class HttpException extends Error {
  public status: number;
  public message: string;
  public data?: object;

  constructor(status: number, message: string, data?: object) {
    super(message);
    this.status = status;
    this.message = message;
    this.data = data;
  }
}
