import React, { Component } from 'react';
import './Header.scss';
import logo from '../../assets/vocab-cuckoo48.png';

class Header extends Component {
  constructor(props) {
    super(props);
    this.navigationClick = this.navigationClick.bind(this);
    this.logInButtonClick = this.logInButtonClick.bind(this);
  }

  navigationClick(ev) {
    const { buttonClick } = this.props;
    const navigationPage = ev.currentTarget.className;

    buttonClick(navigationPage);
  }

  logInButtonClick(ev) {
    const { logInOrOut } = this.props;
    const btnState = ev.target.innerText;

    logInOrOut(btnState);
  }

  render() {
    const { buttonState } = this.props;

    return (
      <div className="Header">
        <img className="logo" src={logo} alt="Logo" />
        <div className="home" onClick={this.navigationClick}>Vocab Cuckoo</div>
        <button className="login" onClick={this.logInButtonClick} type="submit">{buttonState}</button>
        <button className="option" onClick={this.navigationClick} type="submit">
          <i className="fas fa-cog" />
        </button>
      </div>
    );
  }
}

export default Header;
