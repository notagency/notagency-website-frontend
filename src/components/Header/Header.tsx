import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import * as LangActions from '../../redux/Lang/actions';
import { ReactComponent as Logo } from '../../svg/logo.svg';
import { ReactComponent as IconFacebook } from '../../svg/facebook.svg';
import { ReactComponent as IconGithub } from '../../svg/github.svg';
import { selectLangCode } from '../../redux/Lang/selectors';
import { State } from '../../redux/types';
import Transition from '../Transition';
import styles from './Header.module.scss';

interface Props {
  langCode: string;
  changeLanguage: Function;
  theme?: string;
}

const Header = ({ langCode, changeLanguage, theme }: Props) => {
  const anotherLanguage = langCode === 'ru' ? 'en' : 'ru';
  return (
    <div className={classNames(styles.header, theme)}>
      <div className={classNames(styles.inner)}>
        <div>
          <Transition type="left-to-right" startFrom={200}>
            <div className={classNames(styles.logo, theme)}>
              <Logo />
              <NavLink to="/">
                <span>NotAgency</span>
              </NavLink>
            </div>
          </Transition>
        </div>

        <div className={classNames('text-right')}>
          <div className={classNames(styles.socials)}>
            <a
              className={classNames('zoom-in-link', styles.link)}
              href="https://www.facebook.com/notagency.ru/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Transition type="right-to-left" startFrom={1000}>
                <div className={classNames(styles.icon, styles.facebook, theme)}>
                  <IconFacebook />
                </div>
              </Transition>
            </a>
            <a
              className={classNames('zoom-in-link', styles.link)}
              href="https://github.com/notagency/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Transition type="right-to-left" startFrom={1100}>
                <div className={classNames(styles.icon, styles.github, theme)}>
                  <IconGithub />
                </div>
              </Transition>
            </a>
          </div>
          <div className={classNames(styles.lang)}>
            <Transition type="right-to-left" startFrom={1400}>
              <button
                type="button"
                className={classNames('zoom-in-link', theme)}
                onClick={e => {
                  e.preventDefault();
                  changeLanguage(anotherLanguage);
                }}
              >
                {anotherLanguage}
              </button>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: State) => ({
  langCode: selectLangCode(state)
});

const mapDispatchToProps = (dispatch: Function) => ({
  changeLanguage: (lang: string) => dispatch(LangActions.changeLanguage(lang))
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
