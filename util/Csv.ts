// const papa = require('papaparse');
import * as Papa from 'papaparse';

export const Csv = {
  fromInput: (e: any) => {
    var file: any; // Need types for this
    // only works from fileInput
    if (e.target.files) {
      file = e.target.files[0];
    } else {
      console.log('fromUrl');
      Papa.parse(e, {
        download: true,
        quoteChar: '"',
        complete: function (results) {
          console.log(results);
        },
      });
    }

    let last = JSON.parse(localStorage.getItem('using'));
    if (!last) {
      console.log('no last');
      last = {};
      last.name = 'nofile';
      last.lastModified = Date.now();
    }
    if (
      file.name != last.name ||
      (file.lastModified != last.lastModified && last)
    ) {
      console.log('File has been changed, using new file');
      //TODO: backup old files text to a new file
      let oldFile = localStorage.getItem('currentFile');
      let notUsing = localStorage.getItem('using');
      localStorage.setItem('oldFile', oldFile);
      localStorage.setItem('notUsing', notUsing);
      localStorage.removeItem('currentFile');
      localStorage.removeItem('using');
      Papa.parse(file, {
        complete: function (results) {
          let unParsed = Papa.unparse(results.data, {
            quotes: true,
            quoteChar: '"',
          });

          let fileArr = {
            name: file.name,
            lastModified: file.lastModified,
            lastModifiedDate: file.lastModifiedDate,
            size: file.size,
          };
          localStorage.setItem('using', JSON.stringify(fileArr));
          localStorage.setItem('currentFile', unParsed);
        },
      });
    } else {
      console.log('File not changed, using file from storage');
      console.log('using:', JSON.parse(localStorage.getItem('using')));
    }
  }, // fromInput

  fromUrl: () => {
    let url = document.querySelector('#urlSelect');
  },

  backUpCurrent: () => {
    let file = localStorage.getItem('currentFile');
    console.log(file);
    // var fs = require("fs");
  },

  getStarts: () => {
    let file = localStorage.getItem('currentFile');
    let parsed = Papa.parse(file);
    let data = parsed.data;
    let startData = [];
  },

  getComps: () => {
    const file = localStorage.getItem('currentFile');
    const parsed = Papa.parse(file);
    const data = parsed.data;

    let compData = [];
    const compBoats = data.filter((item) => {
      return item[0] == 'comphigh';
    });

    interface IComp {
      id: number;
      compId: string;
    }
    compBoats.sort().forEach((compBoat) => {
      let competitor = {} as IComp;
      competitor.id = compBoat[2];
      competitor.compId = compBoat[2];
      const compRows = data.filter((item) => {
        var regex = new RegExp(`^comp`, 'g');
        return item[0].match(regex) && item[2] == compBoat[2];
      });
      compRows.forEach((item) => {
        // remove comp from property name
        const newName = item[0].replace('comp', '');
        competitor[newName] = item[1];
      });
      compData.push(competitor);
    }); //each compBoats
    var sorted = compData.sort((a, b) => {
      return a.boat - b.boat;
    });
    //console.log(compData)
    return compData;
  }, // getComps

  /** RESULT ROWS
   *   This is the result rows from blw file
   *   "rft","19:37:23","26","106"
   *   "rst","18:40:00","26","106"
   *   "rpts","5","26","106"
   *   "rpos","5","26","106"
   *   "rdisc","0","26","106"
   *   "rcor","0:57:05","26","106"
   *   "rrestyp","4","26","106"
   *   "rele","0:57:23","26","106"
   *   "srat","0","26","106"
   *   "rewin","0:06:21","26","106"
   *   "rrwin","238.841","26","106"
   *   "rrset","0","26","106"
   */

  getResults: () => {
    const file = localStorage.getItem('currentFile');
    const parsed = Papa.parse(file);
    const data = parsed.data;
    let resultsArr = [];
    const results = data.filter((item) => {
      return item[0] == 'rele';
    });

    //LL('results', results)
    results.forEach((result) => {
      const resultRow = {
        id: parseInt(result[3] + result[2]),
        compId: result[2],
        raceId: result[3],
        finish: Csv.resultHelp('rft', data, result),
        start: Csv.resultHelp('rst', data, result),
        points: Csv.resultHelp('rpts', data, result),
        position: Csv.resultHelp('rpos', data, result),
        discard: Csv.resultHelp('rdisc', data, result),
        corrected: Csv.resultHelp('rcor', data, result),
        rrestyp: Csv.resultHelp('rrestyp', data, result),
        elapsed: Csv.resultHelp('rele', data, result),
        srat: Csv.resultHelp('srat', data, result),
        rewin: Csv.resultHelp('rewin', data, result),
        rrwin: Csv.resultHelp('rrwin', data, result),
        rrset: Csv.resultHelp('rrset', data, result),
      };
      resultsArr.push(resultRow);
    }); // forEach
    //console.log(resultsArr);
    return resultsArr;
  },

  resultHelp: (resultTag: string, data: Object[], result: any) => {
    let res = data.filter((item) => {
      return (
        item[0] == resultTag && item[2] == result[2] && item[3] == result[3]
      );
    });
    if (res[0]) {
      return res[0][1];
    }
  }, // resultsHelp

  writeResult: (data: any) => {
    // get new result
    return data;
    // forEach new result we find match's in CSV for rft, rst, rele
    // let store = getStore("results").get(
    //   parseInt(`${data.getResult[1]}${data.getResult[0]}`)
    // );
  },

  getFleets: () => {
    const file = localStorage.getItem('currentFile');
    const parsed = Papa.parse(file);
    const data = parsed.data;
    const fleetsRaw = data.filter((item) => {
      return item[0] == 'serpubgroupvalues';
    });
    const fleets = fleetsRaw[0][1].match(/[^|]+/g);
    //console.log(fleets);
    return fleets;
  }, // getFleets

  getRaces: () => {
    const file = localStorage.getItem('currentFile');
    const parsed = Papa.parse(file);
    const data = parsed.data;
    let raceData = [];
    //races =[0-racename,1-NAME,2-space,3-ID]
    const races = data.filter((item) => {
      return item[0] == 'racerank';
    });

    interface IRaceObj {
      id?: number;
      raceId?: string;
      starts?: string[];
    }

    races.forEach((race) => {
      //console.log('race',race)
      let raceObj: IRaceObj = {};
      raceObj.id = parseInt(race[3]);
      raceObj.raceId = race[3];
      const resultRows = data.filter((item) => {
        var regex = new RegExp(`^race`, 'g');
        return item[0].match(regex) && item[3] == race[3];
      });

      let raceStarts = [];
      resultRows.forEach((item) => {
        if (item[0] == 'racestart') {
          let stringToSplit = item[1].split('|');
          let fleetStart = stringToSplit[1];
          let fleetName = stringToSplit[0].split('^')[1];
          raceStarts.push({ fleet: fleetName, start: fleetStart });
        } else {
          const newName = item[0].replace('race', '');
          raceObj[newName] = item[1];
        }
      });

      raceStarts.forEach((start) => {
        raceObj.starts = raceStarts;
      });

      raceData.push(raceObj);
    });

    return raceData;
  }, // getRaces

  getSeries: () => {
    const file = localStorage.getItem('currentFile');
    const parsed = Papa.parse(file);
    const data = parsed.data;
    let seriesData = [];
    const seriesRows = data.filter((item) => {
      var regex = new RegExp(`^ser`, 'g');
      return item[0].match(regex);
    });

    let seriesObj = {};
    seriesRows.forEach((item) => {
      const newName = item[0].replace('ser', '');
      seriesObj[newName] = item[1];
    });

    seriesData.push(seriesObj);
    return seriesData;
  }, // getSeries

  downloadURL: function (url, name) {
    var link = document.createElement('a');
    link.download = name;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // delete link;
  },

  downloadFile: function (localStoreFile) {
    var data = localStorage.getItem('savedFile');
    var blob = new Blob([data], { type: 'text/txt' });
    var url = window.URL.createObjectURL(blob);
    var using = JSON.parse(localStorage.getItem('using'));
    // LL(using)
    this.downloadURL(url, using.name);
  },
}; // Csv namespace
