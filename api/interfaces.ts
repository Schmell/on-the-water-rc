// Just for code completion and compilation - defines
// the interface of objects stored in the emails table.

export interface ICompetitor {
  id?: number;
  compId: number;
  boat: string;
  fleet: string;
  helmname: string;
}

export interface IRace {
  id?: number;
  name: string;
  date: string; // need date
  time: string; // need timestamp
  sailed?: boolean;
}

export interface IResult {
  id?: number;
  raceId: number;
  compId: number;
  start?: string; // better types her of course/ maybe
  finish?: string;
  elapsed?: string;
  position?: string;
}
export interface ISeries {
  id?: number;
  event: string;
}
