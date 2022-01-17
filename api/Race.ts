import { db } from './appdb';
import { Competitor } from './Competitor';
import { IRace, IResult } from './interfaces';

export class Race implements IRace {
  id?: number;
  name: string;
  date: string; // need date
  time: string; // need timestamp
  sailed?: boolean;
  results: IResult[];
  competitors: Competitor[];

  constructor(race: IRace) {
    this.name = race.name;
    this.date = race.date;
    this.time = race.time;
    if (race.sailed) this.sailed = race.sailed;
    if (race.id) this.id = race.id;

    Object.defineProperties(this, {
      results: { value: [], enumerable: false, writable: true },
      competitors: { value: [], enumerable: false, writable: true },
    });
  }

  async loadNavigationProperties() {
    [this.results] = await Promise.all([
      db.results.where('raceId').equals(this.id!).toArray(), // bang
    ]);
  }

  save() {
    return db.transaction('rw', db.races, db.results, async () => {
      // Add or update our selves. If add, record this.id.
      this.id = await db.races.put(this);
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
