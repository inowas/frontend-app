import { GenericObject } from '../../genericObject/GenericObject';
import { IDateTimeValue } from '../monitoring/Sensor.type';
import { IValueProcessing, IValueProcessingOperator } from './Processing.type';

export const operators = ['+', '-', '*', '/', '<', '<=', '>', '>=', '='];

class ValueProcessing extends GenericObject<IValueProcessing> {
  public static fromObject(obj: IValueProcessing) {
    return new ValueProcessing(this.cloneDeep(obj));
  }

  get id() {
    return this._props.id;
  }

  get type(): string {
    return this._props.type;
  }

  get begin(): number {
    return this._props.begin;
  }

  set begin(value) {
    this._props.begin = value;
  }

  get end(): number {
    return this._props.end;
  }

  set end(value) {
    this._props.end = value;
  }

  get operator(): IValueProcessingOperator {
    return this._props.operator;
  }

  set operator(value) {
    this._props.operator = value;
  }

  get value(): number {
    return this._props.value;
  }

  set value(value) {
    this._props.value = value;
  }

  public async apply(input: IDateTimeValue[]) {
    return input
      .map((i) => {
        if (i.timeStamp < this.begin || i.timeStamp > this.end) {
          return i;
        }

        if (this.operator === '+') {
          i.value += this.value;
          return i;
        }

        if (this.operator === '-') {
          i.value -= this.value;
          return i;
        }

        if (this.operator === '*') {
          i.value *= this.value;
          return i;
        }

        if (this.operator === '/') {
          i.value /= this.value;
          return i;
        }

        if (this.operator === '<' && i.value < this.value) {
          return i;
        }

        if (this.operator === '<=' && i.value <= this.value) {
          return i;
        }

        if (this.operator === '>' && i.value > this.value) {
          return i;
        }

        if (this.operator === '>=' && i.value >= this.value) {
          return i;
        }

        if (this.operator === '=') {
          i.value = this.value;
          return i;
        }

        return undefined;
      })
      .filter((i) => i !== undefined) as IDateTimeValue[];
  }
}

export default ValueProcessing;
