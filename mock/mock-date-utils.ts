import * as moment from 'moment';
import { get } from 'lodash';

export const getTodayAsIsoDate = () => new Date().toISOString().split('T')[0];

export const getIsoDateDaysInFuture = (daysAhead: number) => {
  const today = moment();
  const futureDate = today.add(daysAhead, 'days');
  return futureDate.format('YYYY-MM-DD');
};

export const getNextWorkingDayAsIsoDate = () => {
  const today = moment();
  const sunday = 0;
  let nextWorkingDay = today.add(1, 'day');
  if (today.day() === sunday) {
    nextWorkingDay = nextWorkingDay.add(1, 'day');
  }
  return nextWorkingDay.toISOString().split('T')[0];
};

export const getPreviousWorkingDayAsIsoDate = () => {
  const today = moment();
  const sunday = 0;
  let previousWorkingDay = today.add(-1, 'day');
  if (today.day() === sunday) {
    previousWorkingDay = previousWorkingDay.add(-1, 'day');
  }
  return previousWorkingDay.toISOString().split('T')[0];
};

export const inNext2Days = <T>(section: T): boolean => {
  const slotDate = get(section, 'slotDetail.start', '') as string;

  const today: boolean = moment(slotDate).isSame(moment(), 'day');
  const tomorrow: boolean = moment(slotDate).isSame(moment().add(1, 'day'), 'day');

  return today || tomorrow;
};
