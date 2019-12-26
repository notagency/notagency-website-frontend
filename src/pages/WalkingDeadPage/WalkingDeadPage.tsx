import React from 'react';
// import classNames from 'classnames';
import styles from './WalkingDeadPage.module.scss';

interface Props {}

interface State {
  iframeWidth: number;
  iframeHeight: number;
  iframeTop: number;
}

export default class WalkingDeadPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      iframeWidth: 0,
      iframeHeight: 0,
      iframeTop: 0
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.fixSize);
    this.fixSize();
  }

  fixSize = () => {
    const iframeHeight = window.innerHeight / 1.1;
    const iframeWidth = window.innerWidth / 1.1;
    const iframeTop = (window.innerHeight - iframeHeight) / 2;
    this.setState({ iframeWidth, iframeHeight, iframeTop });
  };

  render() {
    const { iframeWidth, iframeHeight, iframeTop } = this.state;
    return (
      <div className={styles.viewport}>
        <iframe
          src="https://wd.notagency.ru/"
          width={`${iframeWidth}px`}
          height={`${iframeHeight}px`}
          style={{ top: `${iframeTop}px` }}
          title="The Walking Dead Game"
        />
      </div>
    );
  }
}
