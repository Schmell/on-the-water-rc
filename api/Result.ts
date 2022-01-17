import { db } from './appdb';
import { Competitor } from './Competitor';
import { Race } from './Race';
import { IResult } from './interfaces';

export class Result implements IResult {
  id?: number;
  raceId: number;
  compId: number;
  start?: string; // better types her of course/ maybe
  finish?: string;
  elapsed?: string;
  position?: string;
  races?: Race[];
  comps?: Competitor[];

  constructor(
    raceId: number,
    compId: number | undefined,
    id?: number,
    start?: string,
    finish?: string,
    elapsed?: string,
    position?: string
  ) {
    this.raceId = raceId;
    if (compId) this.compId = compId;
    if (start) this.start = start;
    if (finish) this.finish = finish;
    if (elapsed) this.elapsed = elapsed;
    if (position) this.position = position;
    if (id) this.id = id;

    // Define navigation properties.
    Object.defineProperties(this, {
      races: { value: [], enumerable: false, writable: true },
      comps: { value: [], enumerable: false, writable: true },
    });
  }

  public async loadRaces() {
    this.races = await db.races.toArray();
  }

  public async loadCompetitors() {
    this.comps = await db.comps.toArray();
  }

  public async loadNavigationProperties() {
    // load stuff that relates to this result
    [this.races, this.comps] = await Promise.all([
      db.races.where('raceId').equals(this.id!).toArray(), // bang
      db.comps.where('raceId').equals(this.id!).toArray(), // bang
    ]);
  }

  public save() {
    return db.transaction('rw', db.results, db.comps, async () => {
      // Add or update our selves. If add, record this.id.
      this.id = await db.results.put(this);

      // this sets resultId to find other updates
      let [raceId, compId] = await Promise.all([
        Promise.all(this.races!.map((race) => db.races.put(race))), // bang
        Promise.all(this.comps!.map((comp) => db.comps.put(comp))), // bang
      ]);

      // cascade delete
      await Promise.all([
        db.races
          .where('raceId')
          .equals(this.id) // references us
          .and((race) => raceId.indexOf(race.id!) === -1) // Not anymore in our array // bang
          .delete(),

        db.comps
          .where('raceId')
          .equals(this.id) // references us
          .and((comp) => compId.indexOf(comp.id!) === -1) // Not anymore in our array // bang
          .delete(),
      ]);
    });
  }
}
