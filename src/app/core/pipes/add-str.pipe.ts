import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addStr'
})
export class AddStrPipe implements PipeTransform {

  defaultPostfix = 'X?X';

  transform(value: any, args?: any): any {
    return value + (args || this.defaultPostfix);
  }

}
