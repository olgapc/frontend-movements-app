import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/users/services/auth.service';
import { Task } from '../models/task';
import { TemplateService } from '../services/template.service';
import { MatAccordion } from '@angular/material/expansion';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TemplatesComponent implements OnInit {

  @ViewChild('outerSort', { static: true }) sort: MatSort;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;
  @ViewChildren('innerTables') innerTables: QueryList<MatTable<Task>>;
  templates: Task[];
  paginator: any;
  linkPaginator: string = '/templates/page';
  displayedColumns: string[] = ['description', 'deadline', 'createAt', 'options'];
  expandedElement: Task | null;
  dataSource: MatTableDataSource<Task> = new MatTableDataSource<Task>();

  constructor(private activatedRoute: ActivatedRoute,
    public authService: AuthService,
    private templateService: TemplateService,
    private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = + params.get('page');

      if (!page) {
        page = 0;
      }

      this.templateService.getTemplates()
        .subscribe(response => {
            this.dataSource.data = response;
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            console.log(this.dataSource.data);
        });
    })
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleRow(element: Task) {
    element.subtasks && (element.subtasks as MatTableDataSource<Task>).data.length ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
    this.cd.detectChanges();
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<Task>).sort = this.innerSort.toArray()[index]);
  }

  applyInnerFilter(filterValue: string) {
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<Task>).filter = filterValue.trim().toLowerCase());
  }

}
