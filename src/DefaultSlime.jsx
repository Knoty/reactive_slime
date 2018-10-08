import React, { Component } from 'react';
import SlimeView from './SlimeView.jsx';
import PropTypes from 'prop-types';

class DefaultSlime extends Component {
    constructor(props) {
        super(props);
        this.state = {
            animationStatus: ''
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.hp > this.props.hp) {
            console.log('slime hit animation');
            this.hitAnimation();
            if (this.props.hp <= 0 && prevProps.hp !== this.props.hp) {
                console.log('slime die animation');
                this.setState(
                    {animationStatus: 'dying'},
                    () => {
                        setTimeout(
                            () => this.setState({animationStatus: 'dead'}),
                            500
                        )
                    }
                )
            }
        } else if (prevProps.hp < this.props.hp && prevProps.hp > 0) {
            console.log('slime heal animation');
            this.setState(
                {animationStatus: 'was_healed'},
                () => {
                    setTimeout(
                        () => this.setState({animationStatus: ''}),
                        1000
                    )
                }
            )
        } else if ((prevProps.hp === undefined || prevProps.hp <= 0) && this.props.hp === this.props.maxHP) {
            console.log('slime create animation');
            setTimeout(
                () => this.creationAnimation(),
                1000
            )
        }
    }

    hitAnimation() {
        this.setState(
            {animationStatus: 'was_hit'},
            () => {
                setTimeout(
                    () => this.setState({animationStatus: ''}),
                    500
                )
            }
        )
    }

    creationAnimation() {
        this.setState(
            {animationStatus: 'was_created'},
            () => {
                setTimeout(
                    () => this.setState({animationStatus: ''}),
                    5000
                )
            }
        )
    }

    render() {
        return (
            <SlimeView
                {...this.props}
                animationClass = {this.state.animationStatus}
            />
        )
    }
}

DefaultSlime.propTypes = {
    hp: PropTypes.number.isRequired,
    maxHP: PropTypes.number.isRequired
};

export default DefaultSlime;