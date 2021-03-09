import { createSelector } from '@ngrx/store';
import { StoreModel } from '../../app/shared/models/store.model';
import { AppConfig } from '../../app/providers/app-config/app-config.model';

export const selectAppConfig = (state: StoreModel): AppConfig => state.appConfig;

export const selectRole = createSelector(
  selectAppConfig,
  (appConfig: AppConfig): string => appConfig.role,
);

export const selectLogoutEnabled = createSelector(
  selectAppConfig,
  (appConfig: AppConfig): boolean => appConfig.journal.enableLogoutButton,
);