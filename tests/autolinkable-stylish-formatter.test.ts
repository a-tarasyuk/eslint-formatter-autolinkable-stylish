import { CLIEngine } from 'eslint';
import autolinkableStylishFormatter from '../src/autolinkable-stylish-formatter';
import report from './__fixtures__/report.json';
import parsingErrorsReport from './__fixtures__/parsing-errors-report.json';

describe('autolinkable-stylish-formatter', () => {
  it('matches its snapshot', () => {
    expect(
      autolinkableStylishFormatter(report as CLIEngine.LintResult[]),
    ).toMatchSnapshot();
  });

  it('matches its snapshot with parsing errors', () => {
    expect(
      autolinkableStylishFormatter(
        parsingErrorsReport as CLIEngine.LintResult[],
      ),
    ).toMatchSnapshot();
  });
});
