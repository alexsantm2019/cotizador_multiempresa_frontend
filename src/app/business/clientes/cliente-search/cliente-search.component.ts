import { Component, EventEmitter, output, Output, signal } from '@angular/core';
import { TablerIconComponent } from "angular-tabler-icons";
import { MatLabel, MatFormField, MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-cliente-search',
  standalone: true,
  imports: [TablerIconComponent, MatLabel, MatFormField,   MatFormFieldModule,
  MatInputModule],
  templateUrl: './cliente-search.component.html',
  styleUrl: './cliente-search.component.scss'
})
export class ClienteSearchComponent {
  searchTerm = signal('');
  searchChange = output<string>();

  onSearchChange(value: string | null | undefined) {
    const v = (value ?? '').toString();
    this.searchTerm.set(v);
    this.searchChange.emit(v);
  }
}
