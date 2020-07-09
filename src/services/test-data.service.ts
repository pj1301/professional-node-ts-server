import { injectable } from 'inversify';

@injectable()
export class TestDataService {

  getTestData(): {data: string} {
    return {data: 'data'};
  }

  // postTestData() {}

  // patchTestData() {}

  // putTestData() {}

  // deleteTestData() {}
}