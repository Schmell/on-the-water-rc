import { db } from './appdb';
import { Competitor } from './Competitor';
import { ICompetitor, IRace, IResult, ISeries } from './interfaces';
import { Race } from './Race';

export class Series implements ISeries {
  id?: number;
  event: string;
  races: Race[];
  comps: Competitor[];
  results: IResult[];

  constructor(series: ISeries) {
    if (series.id) this.id = series.id;

    Object.defineProperties(this, {
      races: { value: [], enumerable: false, writable: true },
      competitors: { value: [], enumerable: false, writable: true },
      results: { value: [], enumerable: false, writable: true },
    });
  }

  async loadCompetiors() {
    this.comps = await db.comps.toArray();
  }

  async loadRaces() {
    this.races = await db.races.toArray();
  }

  async loadNavigationProperties() {
    [this.results, this.comps, this.races] = await Promise.all([
      db.results.where('raceId').equals(this.id!).toArray(),
      db.comps.where('compId').equals(this.id!).toArray(),
      db.races.where('raceId').equals(this.id!).toArray(),
    ]);
  }

  save() {
    return db.transaction('rw', db.series, db.results, async () => {
      // Add or update our selves. If add, record this.id.
      this.id = await db.series.put(this);
      let [resultId] = await Promise.all([
        Promise.all(this.results.map((result) => db.results.put(result))),
      ]);

      await Promise.all([
        db.races
          .where('raceId')
          .equals(this.id) // references us
          .and((result) => resultId.indexOf(result.id!) === -1) // Not anymore in our array // bang
          .delete(),
      ]);
    });
  }
}
