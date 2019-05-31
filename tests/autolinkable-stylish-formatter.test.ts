import autolinkableStylishFormatter from '../src/autolinkable-stylish-formatter';
import report from './__fixtures__/report.json';

describe('autolinkable-stylish-formatter', () => {
  it('matches its snapshot', () => {
    expect(autolinkableStylishFormatter(report)).toMatchSnapshot();
  })
})