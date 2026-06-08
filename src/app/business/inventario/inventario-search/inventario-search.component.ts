import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TablerIconComponent } from 'angular-tabler-icons';

@Component({
  selector: 'app-inventario-search',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    TablerIconComponent,
  ],
  templateUrl: './inventario-search.component.html',
  styleUrls: ['./inventario-search.component.scss'],
})
export class InventarioSearchComponent {
  @Output() searchChange = new EventEmitter<string>();

  searchTerm = signal('');

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.searchChange.emit(value);
  }
}
