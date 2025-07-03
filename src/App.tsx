import { type ReactElement } from 'react';
import { Route, Routes } from 'react-router-dom';

import { ReactQueryProvider } from '@/lib/react-query/provider';
import Home from '@/pages/Home';

export default function App(): ReactElement {
  return (
    <ReactQueryProvider>
      <>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </>
    </ReactQueryProvider>
  );
}
