import * as React from 'react';
import { Link } from 'react-router-dom';

interface AppProps {}

export const App: React.FC<AppProps> = ({}) => {
  return (
    <div>
      <p>Add links here</p>
      <nav
        style={{
          borderBottom: 'solid 1px',
          paddingBottom: '1rem',
        }}
      >
        <Link to="/racing">Racing</Link>
        <Link to="/series">Series</Link>
      </nav>
    </div>
  );
};
