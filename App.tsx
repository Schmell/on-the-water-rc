import * as React from 'react';
import { Link } from 'react-router-dom';
import './style.css';
interface AppProps {}

export const App: React.FC<AppProps> = ({}) => {
  return (
    <div>
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
