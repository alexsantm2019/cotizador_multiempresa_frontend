import { Component, EventEmitter, output, Output, signal } from '@angular/core';
import { TablerIconComponent } from 'angular-tabler-icons';
import { MatLabel, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-paquete-search',
  standalone: true,
  imports: [TablerIconComponent, MatLabel, MatFormField, MatInputModule],
  templateUrl: './paquete-search.component.html',
  styleUrl: './paquete-search.component.scss',
})
export class PaqueteSearchComponent {
  searchTerm = signal('');
  searchChange = output<string>();

  onSearchChange(value: string | null | undefined) {
    const v = (value ?? '').toString();
    this.searchTerm.set(v);
    this.searchChange.emit(v);
  }
}
