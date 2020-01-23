import { Component, OnInit, Input } from '@angular/core';
import { CdkAccordionItem } from '@angular/cdk/accordion';
import { matExpansionAnimations, MatExpansionPanelState } from '@angular/material';

@Component({
  selector: 'app-expansion-panel',
  templateUrl: './app-expansion-panel.component.html',
  styleUrls: ['./app-expansion-panel.component.scss'],
  animations: [matExpansionAnimations.bodyExpansion]
})
export class AppExpansionPanelComponent extends CdkAccordionItem implements OnInit {

  @Input() headerTitle: string;
  @Input() config: [];

  getExpandedState(): MatExpansionPanelState {
    return this.expanded ? 'expanded' : 'collapsed';
  }

  ngOnInit() {


  }

}
