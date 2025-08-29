import type { ReactElement } from 'react';
import { Route, Routes } from 'react-router-dom';

import Home from '@/pages/Home';

export default function App(): ReactElement {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
