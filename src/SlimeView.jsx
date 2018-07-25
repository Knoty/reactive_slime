import React from 'react';
import LevelBar from './LevelBar';
import PropTypes from 'prop-types';

const SlimeView = props => (
    <div className={props.className}>
        <button
            className={`slime_img ${props.additionalClass} ${(props.hp < props.maxHP) ? "injured" : ""}`}
            title={`Slime ${props.name} ${props.id}${(props.hp < props.maxHP) ? `, click to heal for ${props.healPrice}` : ", healthy"}`}
            onClick = {(props.hp < props.maxHP) ? () => props.onClick(props.id) : false}
        />
        <div className="level_bar_wrapper slime_hp_bar" title={`${props.id} slime hp`}>
            <LevelBar
                current = {props.hp}
                max = {props.maxHP}
            />
        </div>
    </div>
);

SlimeView.propTypes = {
    className: PropTypes.string.isRequired,
    hp: PropTypes.number.isRequired,
    maxHP: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
    name: PropTypes.string,
    id: PropTypes.number.isRequired,
    healPrice: PropTypes.number.isRequired,
    additionalClass: PropTypes.string
};

SlimeView.defaultProps = {
    name: "",
    additionalClass: ""
};

export default SlimeView
