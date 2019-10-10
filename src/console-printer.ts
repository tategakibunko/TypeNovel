import { ValidationError } from './modules';

export interface ConsolePrinter {
  printOutput: (output: string) => void;
  printValidationError: (error: ValidationError) => void;
}

export class StdConsolePrinter implements ConsolePrinter {
  public printOutput(output: string) {
    console.log(output);
  }

  public printValidationError(error: ValidationError) {
    const pos = error.codePos;
    const path = pos.path ? `${pos.path} ` : '';
    console.log(`${path}line:${error.codePos.line}, col:${error.codePos.col}, ${error.message}`);
  }
}
