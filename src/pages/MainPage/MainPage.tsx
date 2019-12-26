import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Transition from '../../components/Transition';
import { ReactComponent as HeartIcon } from '../../svg/heart.svg';
import styles from './MainPage.module.scss';
import { State } from '../../redux/types';
import { selectStrings } from '../../redux/Config/selectors';
import { ConfigStrings } from '../../redux/Config/types';
import { selectLangCode } from '../../redux/Lang/selectors';

interface Props {
  langCode: string;
  strings: ConfigStrings;
}

const MainPage = ({ strings }: Props) => (
  <div className={styles.hero}>
    {/* <div className={classNames(styles.webGl)} ref={element => this.threeRootElement = element} /> */}
    <div className={styles.inner}>
      <div>
        <Transition type="top-to-bottom" startFrom={400}>
          <h1 className={styles.slogan}>
            WE <HeartIcon className={styles.heart} /> TO CODE
          </h1>
        </Transition>
      </div>
      <div>
        <Transition type="zoom-in" startFrom={500}>
          <>
            <h3>{strings.index.secondRow}</h3>
            <h3>
              {/* <span className={classNames('screen-sm-min')}>
                {strings.index.anyQuestions}
                <br />
              </span> */}
              <a href="mailto:info@notagency.ru">info@notagency.ru</a>
            </h3>
          </>
        </Transition>
      </div>
    </div>
  </div>
);

const mapStateToProps = (state: State) => ({
  langCode: selectLangCode(state),
  strings: selectStrings(state)
});

export default connect(mapStateToProps)(MainPage);
