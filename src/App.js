import React from 'react';
import './App.css';
import SlimeGroup from './SlimesGroup.jsx';
import CreateSlimeButton from './CreateSlimeButton.jsx';
import DefaultBoss from './DefaultBoss.jsx';

class App extends React.Component {
    maxID = 0;
    maxPoolAmount = 1000;
    newSlimeValue = 100;
    maxSlimesQuantity = 8;
    healAmount = 30;
    healPrice = 5;
    smallestMaxHP = 80;
    highestMaxHP = 121;
    bossPower = 50;

    makeSlime(id) {
        let maxHP = Number(Math.floor(Math.random() * (this.highestMaxHP - this.smallestMaxHP) + this.smallestMaxHP));
        return {
            id: id,
            name: `name${id}`,
            hp: maxHP,
            maxHP: maxHP
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            slimes: [
                this.makeSlime(this.makeID()),
                this.makeSlime(this.makeID())
            ],
            poolAmount: this.maxPoolAmount
        };
    }

    getRandomSlimeID() {
        const slimeNumber = Math.floor(Math.random() * this.state.slimes.length);
        return this.state.slimes[slimeNumber].id
    }

    makeID() {
        return ++this.maxID;
    }

    createSlime() {
        if (this.state.poolAmount >= this.newSlimeValue && this.state.slimes.length < this.maxSlimesQuantity){
            this.setState(
                oldState => ({
                    poolAmount: oldState.poolAmount - this.newSlimeValue,
                    slimes: oldState.slimes.concat(
                        [this.makeSlime(this.makeID())]
                    )
                })
            );
            this.hitSlime(this.getRandomSlimeID())
        }
    }

    healSlime(id) {
        this.setState(
            oldState => {

                const healSlimeByID = (oldSlime) => {
                    if (id !== oldSlime.id)
                        return oldSlime;
                    if (oldSlime.hp === oldSlime.maxHP) {
                        console.log('Слайм полность здоров!');
                        return oldSlime;
                    }
                    let newHP = Number(oldSlime.hp) + Number(this.healAmount);
                    if (newHP > oldSlime.maxHP) {
                        newHP = oldSlime.maxHP
                    }
                    if (newHP > oldSlime.hp) {
                        oldState.poolAmount -= this.healPrice;
                        console.log('Слайм №' + id + ' с ' + oldSlime.hp + ' хп был вылечен на ' + this.healAmount + ' хп, и теперь имеет ' + newHP + ' хп.');
                        this.hitSlime(this.getRandomSlimeID())
                    }
                    return Object.assign({}, oldSlime, { hp: newHP });
                };

                return {
                    slimes: oldState.slimes.map(
                        healSlimeByID
                    )
                };
            }
        );
        this.hitSlime(this.getRandomSlimeID())
    }

    hitSlime(id) {
        console.log('В ответ босс нанес ' + this.bossPower + ' повреждений слайму №' + id);
        this.setState(
            oldState => {

                const hitSlimeByID = (oldSlime) => {
                    if (id !== oldSlime.id)
                        return oldSlime;
                    let newHP = Number(oldSlime.hp) - Number(this.bossPower);
                    if (newHP <= 0) {
                        console.log('Слайм №' + oldSlime.id + ' погиб. T_T');
                        return undefined;
                    }
                    return Object.assign({}, oldSlime, { hp: newHP });
                };

                return {
                    slimes: oldState.slimes.map(
                        hitSlimeByID
                    ).filter((slime) => {
                        return slime !== undefined
                    })
                };
            }
        );
    }

    render() {
        return (
            <div className='App'>

                {
                    this.state.slimes.length <= 0
                    &&
                    <div className='lose_screen'>
                        <div className='lose_message'>
                            <h1>Вы проиграли! Т_Т</h1>
                        </div>
                    </div>
                }

                <div className='App-intro'>
                    <h2>Welcome to Slimes Rumble!</h2>
                </div>

                {
                    this.state.slimes.length < this.maxSlimesQuantity && this.state.poolAmount > this.healPrice
                    &&
                    <CreateSlimeButton
                        currentPoolAmount = {this.state.poolAmount}
                        maxPoolAmount = {this.maxPoolAmount}
                        onClick = {() => this.createSlime()}
                    />
                }

                <SlimeGroup
                    slimes = {this.state.slimes}
                    healSlime = {(id) => this.healSlime(id)}
                />

                <DefaultBoss
                    reaction = {() => this.hitSlime(this.getRandomSlimeID())}
                />
            </div>
        )
    }
}

export default App;
