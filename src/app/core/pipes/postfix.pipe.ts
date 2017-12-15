import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'postfix'
})
export class PostfixPipe implements PipeTransform {

  defaultPostfix = 'X?X';

  constructor() {

  }

  transform(value: any, args?: any): any {
    return value + (args || this.defaultPostfix);
  }

}
