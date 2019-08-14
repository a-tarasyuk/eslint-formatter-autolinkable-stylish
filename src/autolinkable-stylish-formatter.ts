import chalk from 'chalk';
import { CLIEngine } from 'eslint';
import { sep } from 'path';

interface Rule {
  name: string;
  len: number;
}

interface Path {
  filePath: string;
  len: number;
}

interface Message {
  errorType: string;
  message: string;
  rule: Rule;
  path: Path;
}

interface InitialData {
  maxRuleLen: number;
  maxPathLen: number;
  messages: Message[];
}

const SEPARATOR = '\n';
const WARNING = 'WARNING';
const ERROR = 'ERROR';

const isError = (severity: number) => severity === 2;

const pad = (str: string, minLen: number, maxLen: number) => (
  maxLen <= minLen
    ? str
    : `${ str }${ ' '.repeat(maxLen - minLen) }`
);

const buildPath = (filePath: string, line: number, column: number) => {
  const path = !filePath.includes('/') && !filePath.includes('\\')
    ?`.${ sep }${ filePath }`
    : filePath;

  return [
    path,
    line ? `:${ line }`: '',
    column ? `:${ column }`: '',
  ].join('');
}

const getErrorType = (severity: number, isRaw = true) => {
  const type = isRaw
    ? isError(severity) ? ERROR : WARNING
    : isError(severity) ? chalk.red(ERROR) : chalk.blue(WARNING);

  return `${ type }: `;
};

const buildMessage = ({ errorType, message, rule, path }: Message, maxPathLen: number, maxRuleLen: number) => (
  `${ errorType }${ pad(path.filePath, path.len, maxPathLen) } ${ pad(rule.name, rule.len, maxRuleLen) } ${ message }`
);

const buildOutput = (result: CLIEngine.LintResult): string => {
  const initialData: InitialData = {
    maxRuleLen: 0,
    maxPathLen: 0,
    messages: [],
  };

  const {
    maxRuleLen,
    maxPathLen,
    messages,
  } = result.messages.reduce(({ maxRuleLen, maxPathLen, messages }, { severity, message, ruleId, column, line }) => {
    const errorType = getErrorType(severity);
    const path = buildPath(result.filePath, line, column);

    const ruleName = ruleId ? ruleId : '';
    const ruleLen = ruleName.length;
    const pathLen = errorType.length + path.length;

    return {
      maxRuleLen: Math.max(maxRuleLen, ruleLen),
      maxPathLen: Math.max(maxPathLen, pathLen),
      messages: [...messages, {
        errorType: getErrorType(severity, false),
        message: chalk.yellow(message),
        rule: { name: chalk.grey(ruleName), len: ruleLen },
        path: { filePath: path, len: pathLen },
      }],
    };
  }, initialData);

  return [
    chalk.white(result.filePath), ...messages.map(message => buildMessage(message, maxPathLen, maxRuleLen)),
  ].join(SEPARATOR);
}

export = (results: CLIEngine.LintResult[]) => (
  results
    .filter(result => result.errorCount || result.warningCount)
    .map(buildOutput).join(SEPARATOR)
);
