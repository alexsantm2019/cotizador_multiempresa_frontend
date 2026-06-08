import { Component, EventEmitter, output, Output, signal } from '@angular/core';
import { TablerIconComponent } from 'angular-tabler-icons';
import { MatLabel, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-producto-search',
  standalone: true,
  imports: [TablerIconComponent, MatLabel, MatFormField, MatInputModule],
  templateUrl: './producto-search.component.html',
  styleUrl: './producto-search.component.scss',
})
export class ProductoSearchComponent {
  searchTerm = signal('');
  searchChange = output<string>();

  onSearchChange(value: string | null | undefined) {
    const v = (value ?? '').toString();
    this.searchTerm.set(v);
    this.searchChange.emit(v);
  }
}
