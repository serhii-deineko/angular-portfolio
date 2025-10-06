import {
  trigger,
  transition,
  style,
  query,
  animate,
  stagger,
  animateChild
} from '@angular/animations';

export const fadeInAnimation = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(20px)' }),
    animate('600ms cubic-bezier(0.35, 0, 0.25, 1)',
      style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);

export const listAnimation = trigger('list', [
  transition(':enter', [
    query('@fadeIn', stagger(100, animateChild()))
  ])
]);
