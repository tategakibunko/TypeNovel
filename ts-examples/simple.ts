import { Tnc, CompileResult } from '../dist';

let result: CompileResult = Tnc.fromFile('../tn-examples/04.tn', {
  format: 'html'
});

console.log(result.errors);
console.log(result.output);
