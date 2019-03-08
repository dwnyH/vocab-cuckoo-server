import React, { Component } from 'react';
import './Header.scss';
import logo from '../../assets/birdIcon-16.png';

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
        return (
            <div className="Header">
                <img className="logo" src={logo} alt="Logo" />
                <div className="home" onClick={this.navigationClick}>Vocab Cuckoo</div>
                <button className="login">Login</button>
                <button className="option" onClick={this.navigationClick}>
                    <i className="fas fa-cog"></i>
                </button>
            </div>
        );
    }
}

export default Header;