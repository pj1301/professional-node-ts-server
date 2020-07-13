import { HttpException } from './http-exception';

export class InformationNotFound extends HttpException {
  constructor() {
    super(404, 'Information not found')
  }
}
