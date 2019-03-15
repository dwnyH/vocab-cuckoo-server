import React from 'react';
import Header from './Header';
import { shallow } from 'enzyme';

const setup = () => {
    const props = {
      buttonClick: jest.fn(),
      logInOrOut: jest.fn(),
      buttonState: 'log in'
    };

    const component = shallow(<Header {...props} />);

    return {
      component,
      props
    }
}

describe('Header', () => {
  const { component, props } = setup();

  it ('renders properly', () => {
    expect(component.exists()).toBe(true);
  });

  it ('should call function when navigations are Clicked', () => {
    const title = component.find('.home');
    const option = component.find('.option');
    const login = component.find('.login');
    const navigationEvent = {
        currentTarget: {
            className: 'navigation'
        }
    };
    const loginEvent = {
        target: {
            innerText: 'login'
        }
    };

    title.simulate('click', navigationEvent);
    option.simulate('click', navigationEvent);
    login.simulate('click', loginEvent);

    expect(props.logInOrOut).toHaveBeenCalled();
    expect(props.buttonClick).toHaveBeenCalled();
  });
});
