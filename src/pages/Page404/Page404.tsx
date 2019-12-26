import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

interface Props {
  strings: { [key: string]: string };
}

const Page404 = ({ strings }: Props) => (
  <div>
    <h1 className={classNames('hero-title')}>404</h1>
    <h3 className={classNames('hero-subtitle')}>{strings.pageNotFound}</h3>
    <hr className={classNames('hero-hr')} />
    <h3 className={classNames('hero-subtitle')}>
      {strings.youCanReturn} <Link to="/">{strings.mainPage}</Link>,<br />
      {strings.contactUs} <a href="mailto:info@notagency.ru">info@notagency.ru</a>
    </h3>
  </div>
);

export default Page404;

// export default translate('Page404')(Page404);
