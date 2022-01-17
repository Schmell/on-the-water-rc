import Dexie from 'dexie';
import { Competitor } from './Competitor';
import { IResult, ISeries } from './interfaces';
import { populate } from './populate';
import { Race } from './Race';
import { Result } from './Result';
import { Series } from './Series';
// import { Result } from './Result';

export class OtwDatabase extends Dexie {
  comps: Dexie.Table<Competitor, number>;
  races: Dexie.Table<Race, number>;
  results: Dexie.Table<IResult, number>;
  series: Dexie.Table<ISeries, number>;

  constructor() {
    super('otw-rc'); // Store name
    const db = this;

    // Define tables and indexes
    db.version(1).stores({
      comps: '++id, compId, boat, fleet, helm',
      races: '++id, name, date, time, sailed ',
      results: '++id, raceId, compId, start, finish, elapsed, position',
      series: '++id, event',
    });

    // Map Classes to tbles here
    db.comps.mapToClass(Competitor);
    db.races.mapToClass(Race);
    db.results.mapToClass(Result);
    db.series.mapToClass(Series);
  }
} // AppDatabase

export const db = new OtwDatabase();
db.on('populate', populate);
