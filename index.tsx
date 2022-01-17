import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { App } from './App';
import { RacingPage } from './components/racingPage/RacingPage';
import { ResultsPage } from './components/resultsPage/ResultsPage';
import { SeriesPage } from './components/seriesPage/SeriesPage';

const rootElement = document.getElementById('root');

render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="racing" element={<RacingPage />} />
      <Route path="series" element={<SeriesPage />} />
      <Route path="reasults" element={<ResultsPage />} />
    </Routes>
  </BrowserRouter>,
  rootElement
);
