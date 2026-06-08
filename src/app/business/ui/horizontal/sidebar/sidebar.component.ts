import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  OnChanges,
} from '@angular/core';
import { navItems } from './sidebar-data';
import { Router } from '@angular/router';
import { NavService } from '../../../../services/nav.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { AppHorizontalNavItemComponent } from './nav-item/nav-item.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-horizontal-sidebar',
  standalone: true,
  imports: [AppHorizontalNavItemComponent, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class AppHorizontalSidebarComponent implements OnInit {
  navItems = navItems;
  parentActive = '';
  firstRowItems: any[] = []; // variable para filtro
  secondRowItems: any[] = []; // variable para filtro

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    public navService: NavService,
    public router: Router,
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 1100px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.router.events.subscribe(
      () => (this.parentActive = this.router.url.split('/')[1])
    );
    this.updateItemsByType(); // filtro por tipo
  }

  // Filtro por tipo ddType = 1
  private updateItemsByType(): void {
    this.firstRowItems = this.navItems.filter((item) => item.ddType === '1');
    this.secondRowItems = this.navItems.filter((item) => item.ddType !== '1');
  }

  ngOnInit(): void {}
}
