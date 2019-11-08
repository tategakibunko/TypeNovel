import { Tnc, CompileResult } from '../dist';

let result: CompileResult = Tnc.fromFile('../tn-examples/example.tn', {
  format: 'html'
});

console.log(result.errors);
console.log(result.output);
