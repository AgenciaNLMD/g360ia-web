import { createRoot } from 'react-dom/client';
import FaqSoftware from './components/FaqSoftware';

const el = document.getElementById('faq-root-software');
if (el) createRoot(el).render(<FaqSoftware />);
