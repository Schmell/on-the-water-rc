import { db } from './appdb';
import { ICompetitor, IResult } from './interfaces';

export class Competitor implements ICompetitor {
  id?: number;
  compId: number;
  boat: string;
  fleet: string;
  helmname: string;
  sailno?: string;
  results: IResult[];

  constructor(comp: ICompetitor) {
    this.boat = comp.boat;
    this.helmname = comp.helmname;
    this.fleet = comp.fleet;
    if (comp.id) this.id = comp.id;

    Object.defineProperties(this, {
      results: { value: [], enumerable: false, writable: true },
    });
  }
  getProperties() {
    return Object.values(this);
  }

  async loadNavigationProperties() {
    [this.results] = await Promise.all([
      db.results.where('compId').equals(this.id).toArray(),
    ]);
  }

  save() {
    return db.transaction('rw', db.comps, db.results, async () => {
      this.id = await db.comps.put(this);

      let [resultId] = await Promise.all([
        Promise.all(this.results.map((result) => db.results.put(result))),
      ]);

      await Promise.all([
        db.results
          .where('compId')
          .equals(this.id) // references us
          .and((result) => resultId.indexOf(result.id) === -1) // Not anymore in our array
          .delete(),
      ]);
    });
  }
}
