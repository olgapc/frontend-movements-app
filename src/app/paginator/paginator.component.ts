import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html',
})
export class PaginatorComponent implements OnInit, OnChanges
{

  @Input() paginator: any;
  @Input() linkPaginator: string;
  pages: number[];
  from: number;
  until: number;


  constructor() { }

  ngOnInit(): void {
    //this.pages = new Array(this.paginator.totalPages).fill(0).map((_value, index) => index + 1);
  }

  ngOnChanges() {
    this.from = Math.min(Math.max(1, this.paginator.number - 4), this.paginator.totalPages - 5);
    this.until = Math.max(Math.min(this.paginator.totalPages, this.paginator.number + 4), 6);
    if (this.paginator.totalPages > 5) {
      this.pages = new Array(this.until - this.from + 1).fill(0).map((_value, index) => index + this.from);
    } else {
      this.pages = new Array(this.paginator.totalPages).fill(0).map((_value, index) => index + 1);
    }
  }
}
