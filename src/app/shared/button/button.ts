import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class Button {
  size = input<'extra-small' | 'small' | 'medium' | 'large'>('medium');
  color = input<'default' | 'primary' | 'secondary'>('default');
  rounded = input<'none' | 'small' | 'medium' | 'large' | 'full'>('none');
  text = input.required<string>();
  disabled = input<boolean>(false);

  get sizeClass(): string {
    return this.size() === 'extra-small'
      ? 'p-1 text-xs font-light'
      : this.size() === 'small'
      ? 'px-3 py-1.5 text-sm font-medium'
      : this.size() === 'medium'
      ? 'px-4 py-2.5 text-base font-medium'
      : this.size() === 'large'
      ? 'px-6 py-3.5 text-lg font-semibold'
      : '';
  }

  get colorClass(): string {
    return this.color() === 'default'
      ? 'bg-gray-100 text-gray-900 border border-gray-200 hover:bg-gray-200 active:bg-gray-300 shadow-sm'
      : this.color() === 'primary'
      ? 'bg-blue-500 text-white border border-blue-500 hover:bg-blue-600 active:bg-blue-700 shadow-md hover:shadow-lg'
      : this.color() === 'secondary'
      ? 'bg-gray-800 text-white border border-gray-800 hover:bg-gray-900 active:bg-black shadow-md hover:shadow-lg'
      : '';
  }

  get roundedClass(): string {
    return this.rounded() === 'none'
      ? 'rounded-none'
      : this.rounded() === 'small'
      ? 'rounded-md'
      : this.rounded() === 'medium'
      ? 'rounded-lg'
      : this.rounded() === 'large'
      ? 'rounded-xl'
      : this.rounded() === 'full'
      ? 'rounded-full'
      : '';
  }

  get computedClasses(): string {
    return `${this.sizeClass} ${this.roundedClass} ${this.colorClass} w-full cursor-pointer transition-all duration-200 ease-out select-none outline-none disabled:opacity-50 disabled:cursor-not-allowed`;
  }
}
