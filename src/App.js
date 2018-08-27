import React from 'react';
import './css/App.css';
import SlimeGroup from './SlimesGroup.jsx';
import CreateSlimeButton from './CreateSlimeButton.jsx';
import DefaultBoss from './DefaultBoss.jsx';
import LevelBar from './LevelBar';
import BossMissile from './BossMissile';

function getEmptyPlaceNumber(places) {
    for (let placeNumber = 0; placeNumber < places.length; placeNumber++) {
        if (places[placeNumber].isFree === true) {
            return placeNumber;
        }
    }
    return -1
}

class App extends React.Component {
    maxID = 0;
    beginningSlimesAmount = 2;
    maxSlimesQuantity = 8;
    maxResourceAmount = 1000;
    createSlimeValue = 100;
    smallestMaxHP = 80;
    highestMaxHP = 121; //N.B. highestMaxHP = highestMaxHP - 1
    healAmount = 80;
    healPrice = 5;
    smallestBossPower = 35;
    highestBossPower = 71; //N.B. highestBossPower = highestBossPower - 1
    maxBossHP = 1000;

    slimeConstructor(id, placeNumber) {
        const maxHP = Number(Math.round(Math.random() * (this.highestMaxHP - this.smallestMaxHP) + this.smallestMaxHP));
        return {
            id: id,
            hp: maxHP,
            maxHP: maxHP,
            place: placeNumber
        }
    }

    slimesConstructor(slimes) {
        let slimesArr = [];
        for (let count = 0; count < slimes; count++) {
            slimesArr.push(this.slimeConstructor(this.makeID(), count))
        }
        return slimesArr
    }

    constructor(props) {
        super(props);

        this.state = {
            slimes: this.slimesConstructor(this.beginningSlimesAmount),
            resourceAmount: this.maxResourceAmount,
            bossHP: this.maxBossHP,
            places: [
                {left: 55, top: 260, isFree: false},
                {left: 55, top: 415, isFree: false},
                {left: 195, top: 195, isFree: true},
                {left: 195, top: 350, isFree: true},
                {left: 340, top: 260, isFree: true},
                {left: 340, top: 415, isFree: true},
                {left: 475, top: 195, isFree: true},
                {left: 475, top: 350, isFree: true}
            ]
        };
    }

    getPlayerPower() {
        return 10 * this.state.slimes.length;
    }

    makeID() {
        return ++this.maxID;
    }

    getRandomSlimeID() {
        const slimeNumber = Math.floor(Math.random() * this.state.slimes.length);
        return this.state.slimes[slimeNumber].id
    }

    createSlime() {
        if (this.state.resourceAmount >= this.createSlimeValue && this.state.slimes.length < this.maxSlimesQuantity){
            this.setState(
                oldState => {
                    let placeNumber = getEmptyPlaceNumber(oldState.places);
                    if (placeNumber === -1) {
                        throw new Error('Свободных мест нет')
                    }
                    return {
                        resourceAmount: oldState.resourceAmount - this.createSlimeValue,
                        slimes: oldState.slimes.concat(
                            [this.slimeConstructor(this.makeID(), placeNumber)]
                        ),
                        places: oldState.places.map(
                            (place, index) => index === placeNumber
                                ? Object.assign({}, place, {isFree: false})
                                : place
                        )
                    }
                },
                () => {
                    console.log('Вы создали слайма! Маны потрачено: '+this.createSlimeValue+'.');
                    this.hitSlime(this.getRandomSlimeID(), this.getBossDamage())
                }
            );
        }
    }

    healSlime(id) {
        this.setState(
            oldState => {

                const healSlimeByID = (oldSlime) => {
                    if (id !== oldSlime.id)
                        return oldSlime;
                    if (oldSlime.hp === oldSlime.maxHP) {
                        console.log('Слайм №'+id+' полностью здоров!');
                        return oldSlime;
                    }
                    let newHP = Number(oldSlime.hp) + Number(this.healAmount);
                    if (newHP > oldSlime.maxHP) {
                        newHP = oldSlime.maxHP
                    }
                    if (newHP > oldSlime.hp) {
                        oldState.resourceAmount -= this.healPrice;
                        console.log(
                            'Слайм №'+id+' с '+oldSlime.hp+' хп был вылечен на '+this.healAmount+', и теперь имеет '+newHP+' из '+oldSlime.maxHP+'.'
                        );
                    }
                    return Object.assign({}, oldSlime, {hp: newHP});
                };

                return {
                    slimes: oldState.slimes.map(
                        healSlimeByID
                    )
                };
            },
            () => {
                this.hitSlime(this.getRandomSlimeID(), this.getBossDamage())
            }
        );
    }

    getBossDamage() {
        return Math.round(Math.random() * (this.highestBossPower - this.smallestBossPower) + this.smallestBossPower);
    }

    animateBossAttack(slimeID) {
        this.setState(
            {
                isBossAttacking: slimeID
            }
        )
    }

    hitSlime(id, bossDamage) {
        this.animateBossAttack(id);
        this.setState(
            oldState => {

                const hitSlimeByID = (oldSlime) => {
                    if (id !== oldSlime.id)
                        return oldSlime;
                    let newHP = Number(oldSlime.hp) - bossDamage;
                    console.log(
                        'В ответ босс нанес ' + bossDamage + ' повреждений слайму №' + id + ' c ' + oldSlime.hp + ' хп, и теперь у него ' + newHP + ' хп.'
                    );
                    if (newHP <= 0) {
                        console.log('Слайм №'+oldSlime.id+' погиб. T_T');
                    }
                    return Object.assign({}, oldSlime, {hp: newHP});
                };

                let updatedSlimes = oldState.slimes.map(hitSlimeByID);

                let deadSlimePlaces = updatedSlimes.reduce(
                    (places, slime) => {
                        if (slime.hp <= 0) {
                            places.push(slime.place);
                        }
                        return places
                    },
                    []
                );

                return {
                    slimes: updatedSlimes.filter((slime) => {
                        return slime.hp > 0
                    }),
                    places: oldState.places.map(
                        function (place, index) {
                            if (deadSlimePlaces.includes(index)) {
                                return Object.assign({}, place, {isFree: true})
                            }
                            return place
                        }
                    )
                };
            }
        );
    }

    hitBoss() {
        this.setState(
            oldState => {

                const playerPower = this.getPlayerPower();
                const newHP = Number(oldState.bossHP) - Number(playerPower);

                if (newHP > 0) {
                    console.log('Босс с '+oldState.bossHP+' хп был поражён на '+playerPower+', и теперь имеет '+newHP+'.');
                    return {bossHP: newHP};
                } else {
                    return {bossHP: 0};
                }
            },
            () => {
                this.hitSlime(this.getRandomSlimeID(), this.getBossDamage())
            }
        );
    }

    getSlimesQuantity() {

        const slimes_alive_ratio = this.state.slimes.length / this.maxSlimesQuantity * 100;

        switch (true) {
            case (slimes_alive_ratio <= 0):
                return 'no_slimes';
            case (slimes_alive_ratio > 1 && slimes_alive_ratio < 49):
                return 'few_slimes';
            case (slimes_alive_ratio > 49 && slimes_alive_ratio < 100):
                return 'many_slimes';
            case (slimes_alive_ratio === 100):
                return 'maximum_slimes';
            default:
                return 'maximum_slimes';
        }
    }

    render() {
        return (
            <div className="App">
                <div className="border">
                    {
                        this.state.isBossAttacking
                        &&
                        <BossMissile
                            startPoint = {{x: 900, y: 300}}
                            endPoint = {{x: 100, y: 300}}
                            targetSlime = {this.state.isBossAttacking}
                            onDestroyed = {() => this.setState({isBossAttacking: undefined})}
                        />
                    }

                    {
                        this.state.bossHP <= 0
                        &&
                        <div
                            className="win_screen"
                            title="Поздравляем! Вы одержали победу! Нажмите, чтобы попробовать еще раз."
                            onClick = {() => window.location.reload()}
                        />
                    }

                    {
                        this.state.slimes.length <= 0
                        &&
                        <div
                            className="lose_screen"
                            title="Поражение! Вы проиграли. Нажмите, чтобы попробовать еще раз."
                            onClick = {() => window.location.reload()}
                        />
                    }

                    <SlimeGroup
                        slimes = {this.state.slimes}
                        healPrice = {this.healPrice}
                        healSlime = {(id) => this.healSlime(id)}
                        places = {this.state.places}
                    />

                    {
                        this.state.bossHP > 0
                        &&
                        <DefaultBoss
                            currentHP = {this.state.bossHP}
                            maxHP = {this.maxBossHP}
                            onClick = {() => this.hitBoss()}
                        />
                    }

                    <CreateSlimeButton
                        active = {this.state.slimes.length < this.maxSlimesQuantity && this.state.resourceAmount > this.createSlimeValue}
                        createSlimeValue = {this.createSlimeValue}
                        onClick = {() => this.createSlime()}
                    />

                    <div className="level_bar_wrapper slimes_quantity_bar" title="slimes quantity & power">
                        <div
                            className={`level_bar_label slimes_quantity_label ${this.getSlimesQuantity()}`}
                        />
                        <LevelBar
                            current = {this.state.slimes.length}
                            max = {this.maxSlimesQuantity}
                        />
                    </div>

                    <div className="level_bar_wrapper resources_bar" title="resource">
                        <div
                            className={`level_bar_label resource_label ${(this.state.resourceAmount > 0) ? 'full_resource_label' : 'resource_depleted_label'}`}
                        />
                        <LevelBar
                            current = {this.state.resourceAmount}
                            max = {this.maxResourceAmount}
                        />
                    </div>

                </div>
            </div>
        )
    }
}

export default App;