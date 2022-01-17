import { Csv } from '../util/Csv';
import { db } from './appdb';

export async function populate() {
  const compsFromCsv = Csv.getComps();
  // console.log(compsFromCsv);
  await db.comps.bulkAdd(compsFromCsv);
  const racesFromCsv = Csv.getRaces();
  // console.log(racesFromCsv);
  await db.races.bulkAdd(racesFromCsv);
  const resultsFromCsv = Csv.getResults();
  // console.log(resultsFromCsv);
  await db.results.bulkAdd(resultsFromCsv);
  const seriesFromCsv = Csv.getSeries();
  // console.log(resultsFromCsv);
  await db.series.bulkAdd(seriesFromCsv);
}
