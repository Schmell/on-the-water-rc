import * as React from 'react';
import { Competitor } from '../../api/Competitor';

interface ICompsProps {
  competitor: Competitor;
}

export const Comps: React.FC<ICompsProps> = ({ competitor }) => {
  // console.log('compId: ', competitor.compId);
  return (
    <div className="comp-row" id={competitor.id.toString()}>
      <div className="comp-info">
        <div className="detail-1">{competitor.boat}</div>
        <div className="detail-2">{competitor.sailno}</div>
        <div className="detail-3">{competitor.fleet}</div>
        <div className="detail-4">{competitor.helmname}</div>
      </div>
      <div className="finish-record">
        <div className="finish-info">19:40:48</div>
        <i className="fas fa-edit edit-icon"></i>
        <i className="fas fa-check check-icon"></i>
        <i className="fas fa-trash-can delete-icon"></i>
      </div>
    </div>
  );
};
