import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { RouterModule } from '@angular/router';
import { DateTimeProvider } from '../../app/providers/date-time/date-time';
import { journalReducer } from './journal.reducer';
import { JournalEffects } from './journal.effects';
import { SlotSelectorProvider } from '../../app/providers/slot-selector/slot-selector';
import { SlotProvider } from '../../app/providers/slot/slot';
import { JournalProvider } from '../../app/providers/journal/journal';
import { JournalLogsEffects } from './journal.logs.effects';

@NgModule({
  imports: [
    StoreModule.forFeature('journal', journalReducer),
    EffectsModule.forFeature([
      JournalEffects,
      JournalLogsEffects,
    ]),
    RouterModule,
  ],
  providers: [
    JournalProvider,
    SlotProvider,
    SlotSelectorProvider,
    DateTimeProvider,
  ],
})
export class JournalModule {}