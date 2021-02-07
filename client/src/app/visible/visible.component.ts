import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'visible',
  templateUrl: './visible.component.html',
  styleUrls: ['./visible.component.scss']
})
export class VisibleComponent implements AfterViewInit, OnDestroy {
  @Input() options = {};
  @Output() visible = new EventEmitter();
  @ViewChild('anchor') anchor: ElementRef<HTMLElement>;

  private observer: IntersectionObserver;

  constructor(private host: ElementRef) {
    //
  }

  public ngAfterViewInit(): void {
    const options = {
      root: null,
      ...this.options
    };

    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.visible.emit();
      }
    }, options);

    this.observer.observe(this.anchor.nativeElement);
  }

  public ngOnDestroy(): void {
    this.observer.disconnect();
  }

  get element(): void {
    return this.host.nativeElement;
  }
}
