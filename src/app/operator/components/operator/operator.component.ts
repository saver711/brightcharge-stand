import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { ConvertedOperators, Operator } from '../../operator.model';
import { OperatorState } from '../../state/operator.state';

@Component({
  selector: 'bs-operator',
  templateUrl: './operator.component.html',
  styleUrls: ['./operator.component.scss'],
})
export class OperatorComponent implements OnInit, OnDestroy {
  operator: Operator | null = null;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}
  private dataSubscription!: Subscription;
  ngOnInit(): void {
    this.getOperator();
  }
  @Select(OperatorState.operators) operators$!: Observable<ConvertedOperators>;

  getOperator() {
    this.dataSubscription = this.activatedRoute.data.subscribe({
      next: data => {
        const operator = data['data']['operator'];
        if (operator) {
          this.operator = operator;
        }
      },
    });
  }

  editOperator() {
    this.router.navigate(['edit'], { relativeTo: this.activatedRoute });
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }
}
