import { HttpException } from './http-exception';

export class GeneralError extends HttpException {
  constructor() {
    super(500, 'An error occurred')
  }
}
