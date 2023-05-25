import * as React from 'react';

import cls from './app.module.scss';

export const App = (): JSX.Element => {
  return (
    <div className={cls['app']}>
      Ultimate Network Simulator
    </div>
  );
};
