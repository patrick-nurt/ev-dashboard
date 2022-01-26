import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Utils } from 'utils/Utils';

import { FilterType, TableFilterDef } from '../../../types/Table';
import { TableFilter } from './table-filter';

export class DateRangeTableFilter extends TableFilter {
  public constructor(options: {
    translateService: TranslateService; showSeconds?: boolean; start?: moment.Moment; end?: moment.Moment;
    id?: string; startDateTimeHttpId?: string; endDateTimeHttpId?: string;
  }) {
    super();
    // Define filter
    const startDate = Utils.isNullOrUndefined(options.start) ? moment().startOf('y').toDate() : options.start.toDate();
    const endDate = Utils.isNullOrUndefined(options.end) ? moment().toDate() : options.end.toDate();
    const filterDef: TableFilterDef = {
      id: options.id ? options.id : 'dateRange',
      httpId: '', //Not used as startDateTimeHttpId and endDateTimeHttpId are used instead
      type: FilterType.DATE_RANGE,
      name: 'general.search_date',
      class: 'col-sm-6 col-md-4 col-lg-3',
      dateRangeTableFilterDef: {
        timePicker: true,
        timePicker24Hour: true,
        timePickerSeconds: Utils.isNullOrUndefined(options.showSeconds) ? false : options.showSeconds,
        startDateTimeHttpId: options.startDateTimeHttpId ? options.startDateTimeHttpId : 'StartDateTime',
        endDateTimeHttpId: options.endDateTimeHttpId ? options.endDateTimeHttpId : 'EndDateTime',
        locale: {
          displayFormat: moment.localeData().longDateFormat('lll'),
          applyLabel: options.translateService.instant('general.apply'),
          daysOfWeek: moment.weekdaysMin(),
          monthNames: moment.monthsShort(),
          firstDay: moment.localeData().firstDayOfWeek()
        }
      },
      currentValue: {
        startDate,
        endDate
      },
      items: [this.createQuickAccessDateRanges(options.translateService)],
      reset: () => filterDef.currentValue = { startDate, endDate }
    };
    // Set
    this.setFilterDef(filterDef);
    if (moment.localeData().longDateFormat('lll').match(/A/i)) {
      filterDef.dateRangeTableFilterDef.timePicker24Hour = false;
    }
  }

  private createQuickAccessDateRanges(translateService: TranslateService){
    const rangeObjects: {key: string; label: string; startValue: Date; endValue: Date}[] = [
      { key: 'search_one_minute', label: 'logs.search_one_minute', startValue: moment().subtract(1, 'minute').toDate(), endValue: moment().toDate() },
      { key: 'search_10_minutes', label: 'logs.search_10_minutes', startValue: moment().subtract(10, 'minutes').toDate(), endValue: moment().toDate() },
      { key: 'search_30_minutes', label: 'logs.search_30_minutes', startValue: moment().subtract(30, 'minutes').toDate(), endValue: moment().toDate() },
      { key: 'search_one_hour', label: 'logs.search_one_hour', startValue: moment().subtract(1, 'hour').toDate(), endValue: moment().toDate()  },
      { key: 'search_today', label: 'logs.search_today', startValue: moment().startOf('day').toDate(), endValue: moment().toDate()  },
      { key: 'search_yesterday', label: 'logs.search_yesterday', startValue: moment().subtract(1, 'day').startOf('day').toDate(), endValue: moment().subtract(1, 'day').endOf('day').toDate() },
      { key: 'search_this_week', label: 'logs.search_this_week', startValue: moment().startOf('week').toDate(), endValue: moment().toDate()  },
      { key: 'search_last_week', label: 'logs.search_last_week', startValue: moment().subtract(1, 'week').startOf('week').toDate(), endValue: moment().subtract(1, 'week').endOf('week').toDate()  },
      { key: 'search_this_month', label: 'logs.search_this_month', startValue: moment().startOf('month').toDate(), endValue: moment().toDate()  },
      { key: 'search_last_month', label: 'logs.search_last_month', startValue: moment().subtract(1, 'month').startOf('month').toDate(), endValue: moment().subtract(1, 'month').endOf('month').toDate() },
    ];
    const dateRanges: any = {};
    for (const range of rangeObjects) {
      dateRanges[translateService.instant(range.label)] = [range.startValue, range.endValue];
    }
    return dateRanges;
  }
}
