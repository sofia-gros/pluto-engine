Luxon
Introduction¶
Parse, validate, manipulate, and display dates and times.
Reference
Usage¶
Install
Getting started
Demo
A quick tour
API
Creating a DateTime¶
const dt = DateTime.local(2017, 5, 15, 8, 30);
or
var dt = DateTime.fromISO('2017-05-15');
// var dt = DateTime.fromISO('2017-05-15T17:36');
// var dt = DateTime.fromISO('2017-W33-4');
// var dt = DateTime.fromISO('2017-W33-4T04:45:32.343');
Current date and time¶
const now = DateTime.now();
// const now = DateTime.local();
JSON¶
To JSON
var json = dt.toObject();
From JSON
var dt = DateTime.fromObject(json);
// var dt = DateTime.fromObject({year: 2017, month: 5, day: 15, hour: 17, minute: 36});
Math¶
var dt1 = dt0.plus({ hours: 3, minutes: 2 });
var dt1 = dt0.minus({ days: 7 });
var dt1 = dt0.startOf('day');
var dt1 = dt0.endOf('hour');
Difference¶
var i1 = DateTime.fromISO('1982-05-25T09:45'),
i2 = DateTime.fromISO('1983-10-14T10:30');
i2.diff(i1).toObject() //=> { milliseconds: 43807500000 }
i2.diff(i1, 'hours').toObject() //=> { hours: 12168.75 }
i2.diff(i1, ['months', 'days']).toObject() //=> { months: 16, days: 19.03125 }
i2.diff(i1, ['months', 'days', 'hours']).toObject() //=> { months: 16, days: 19, hours: 0.75 }
Durations¶
var dur = Duration.fromObject({ hours: 2, minutes: 7 });
// dt.plus(dur);
dur.as('seconds') //=> 7620
dur.toObject()    //=> { hours: 2, minutes: 7 }
dur.toISO()       //=> 'PT2H7M'
Parse/Format¶
Parse
var dt = DateTime.fromFormat('12-16-2017', 'MM-dd-yyyy');
// var dt = DateTime.fromFormat('May 25, 1982', 'MMMM dd, yyyy');
// var dt = DateTime.fromFormat('mai 25, 1982', 'MMMM dd, yyyy', { locale: 'fr' });
Format
var s = dt.toFormat('MM-dd-yyyy');
// var s = dt.toFormat('MMMM dd, yyyy')
// var s = dt.setLocale('fr').toFormat('MMMM dd, yyyy')
Relative time¶
Returns a string representation of this date relative to today.
var s = dt.toRelativeCalendar();
var s = dt.toRelativeCalendar({
base: dt0,
locale: string,
unit: string
});
base : The DateTime to use as the basis to which this time is compared. Defaults to now.
locale : Override the locale of this DateTime.
unit : Use a specific unit; if omitted, the method will pick the unit. Use one of 'years', 'quarters', 'months', 'weeks', or 'days'