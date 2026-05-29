import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FAQPage } from './features/faq/pages/FAQPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirects to FAQ page */}
        <Route index element={<Navigate to="/faqs" replace />} />
        <Route path="/faqs" element={<FAQPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;