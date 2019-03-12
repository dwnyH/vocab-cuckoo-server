import React, { Component } from 'react';
import './Header.scss';
import logo from '../../assets/vocab-cuckoo48.png';

class Header extends Component {
  constructor(props) {
    super(props);
    this.navigationClick = this.navigationClick.bind(this);
  }

  navigationClick(ev) {
    const { buttonClick } = this.props;

    buttonClick(ev.currentTarget.className);
  }

  render() {
    const { onClickSignIn } = this.props;

    return (
      <div className="Header">
        <img className="logo" src={logo} alt="Logo" />
        <div className="home" onClick={this.navigationClick}>Vocab Cuckoo</div>
        <button className="login" onClick={onClickSignIn} type="submit">Login</button>
        <button className="option" onClick={this.navigationClick} type="submit">
          <i className="fas fa-cog" />
        </button>
      </div>
    );
  }
}

export default Header;
