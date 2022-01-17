import * as React from 'react';
import { Csv } from '../../util/Csv';
import { CompList } from '../racingPage/CompList';

interface RacingPageProps {}

export const RacingPage: React.FC<RacingPageProps> = ({}) => {
  return (
    <div className="scoring-main">
      <div>Racing Page </div>
      <input type="file" id="fileInput" onChange={Csv.fromInput} />
      <CompList />
    </div>
  );
};
