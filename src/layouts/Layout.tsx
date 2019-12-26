import React from 'react';
import { connect } from 'react-redux';
import Header from '../components/Header';
import * as ConfigActions from '../redux/Config/actions';
import Footer from '../components/Footer';
import ApiService from '../services/ApiService';
import { selectStrings } from '../redux/Config/selectors';
import { State } from '../redux/types';
import { ConfigState, ConfigStrings } from '../redux/Config/types';

interface Props {
  configSet: Function;
  component: React.ComponentType<any>;
  page: React.ComponentType<any>;
  strings: ConfigStrings;
}

class Layout extends React.Component<Props> {
  async componentDidMount() {
    const { configSet } = this.props;
    const data = await ApiService.get();
    configSet(data);
  }

  render() {
    const { component: Component, page: Page, strings, ...rest } = this.props;
    if (!strings) {
      return null;
    }
    return (
      <>
        <Header />
        <Page {...rest} />
        <Footer />
      </>
    );
  }
}

const mapStateToProps = (state: State) => ({
  strings: selectStrings(state)
});

const mapDispatchToProps = (dispatch: Function) => ({
  configSet: (data: ConfigState) => dispatch(ConfigActions.configSet(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
