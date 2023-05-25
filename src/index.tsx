import * as React from 'react';
import ReactDOM from 'react-dom';

import '@/styles/base/normalize.scss';
import '@/styles/base/typography.scss';

import {App} from '@/components/app';

ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root'),
);
