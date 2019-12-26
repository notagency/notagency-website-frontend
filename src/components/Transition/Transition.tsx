import React from 'react';
import classNames from 'classnames';

interface Props {
  startFrom: number;
  type: string;
  children: React.ReactElement;
}

interface State {
  appear: boolean;
}

export default class Transition extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      appear: false
    };
  }

  componentDidMount() {
    // if (this.props.isMobile || !this.props.fromMainPage) {
    //    return;
    // }
    const { startFrom } = this.props;
    const increment = 10;
    let timer = 0;
    const intervalId = setInterval(() => {
      timer += increment;
      if (timer === startFrom) {
        clearInterval(intervalId);
        this.setState({ appear: true });
      }
    }, increment);
  }

  render() {
    const { type, children } = this.props;
    const { appear } = this.state;
    return (
      <div
        className={classNames(type, {
          // animate: !this.props.isMobile && this.props.fromMainPage,
          animate: true,
          'start-animation': appear
        })}
      >
        {children}
      </div>
    );
  }
}
