import { useLiveQuery } from 'dexie-react-hooks';
import * as React from 'react';
import { db } from '../../api/appdb';
import { Comps } from './Comps';

interface ICompListProps {}

export const CompList: React.FC<ICompListProps> = () => {
  const comps = useLiveQuery(() => db.comps.toArray());
  // console.log(comps);
  if (!comps) return null;

  return (
    <div className="comp-panel">
      {comps.map((comp) => (
        <Comps competitor={comp} key={comp.id} />
      ))}
    </div>
  );
};
