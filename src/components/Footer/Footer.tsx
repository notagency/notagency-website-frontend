import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { State } from '../../redux/types';
import { selectStrings, selectYear } from '../../redux/Config/selectors';
import Transition from '../Transition';
import { ConfigStrings } from '../../redux/Config/types';
import styles from './Footer.module.scss';

interface Props {
  year: string;
  strings: ConfigStrings;
}

const Footer = ({ year, strings }: Props) => (
  <div className={classNames(styles.footer)}>
    <Transition type="bottom-to-top" startFrom={1400}>
      <div className={classNames(styles.inner, 'text-center')}>
        <div className={classNames(styles.item, 'screen-sm-min')}>{year} &copy; NotAgency</div>
        <div className={classNames(styles.item)}>{strings.footer.psrn} 314774601700196</div>
        <div className={classNames(styles.item)}>{strings.footer.inn} 771878367680</div>
        <div className="screen-xs-only">
          <div className={classNames(styles.item)}>{year} &copy; NotAgency</div>
        </div>
      </div>
    </Transition>
  </div>
);

const mapStateToProps = (state: State) => ({
  year: selectYear(state),
  strings: selectStrings(state)
});

export default connect(mapStateToProps)(Footer);
