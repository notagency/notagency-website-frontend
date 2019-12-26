import React from 'react';
import { Route, RouteProps } from 'react-router-dom';

declare interface Props extends RouteProps {
  page: React.ComponentType<any>;
  layout: React.ComponentType<any>;
}

export default ({ layout: Layout, page: Page, ...rest }: Props) => (
  <Route {...rest} render={props => <Layout page={Page} {...props} />} />
);
