import { KeysPipe } from './keys.pipe';

describe('keysPipe Tests', () => {
  const value = { one: 1, two: 2, three: 3 };
  let pipe: KeysPipe;

  beforeEach(() => {
    pipe = new KeysPipe();
  });
  it('Should associate key to a value ', () => {
    const result = pipe.transform(value);
    expect(result).toEqual([
      { key: 'one', value: 1 },
      { key: 'two', value: 2 },
      { key: 'three', value: 3 },
    ]);
  });
});
