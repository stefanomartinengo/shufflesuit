import React, {useState, useEffect} from 'react';

export default class Deck extends React.Component {
    constructor() {
        super();
        this.state = {
            deckId: '',
            spades: [],
            clubs: [],
            hearts: [],
            diamonds: [],
        }
        this.timeElapsed = performance.now();
        Array.prototype.deckSort = function() {
            const properSort = ['ACE', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'JACK', 'QUEEN', 'KING'];
            var _this = [];
            properSort.forEach( e => {
                if (this.includes(e)) {
                    _this.push(e);
                }
            })
            return _this;
        }
    }
    componentDidMount() {
        fetch('http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
            .then( (res) => res.json().then( (response) => {
                this.setState({deckId: response.deck_id}, () => {
                    this.drawInterval = setInterval(
                        () => this.draw(),
                        1000
                    );
                })
            }))
    }
    componentWillUnmount() {
        clearInterval(this.drawInterval)
    }

    draw() {
        fetch(`http://deckofcardsapi.com/api/deck/${this.state.deckId}/draw/?count=2`)
        .then( (res) => res.json().then( (response) => {
            if (response.success == false) {
                clearInterval(this.drawInterval);
                alert('cleared deck');
            }
            let draw1 = {suit: response.cards[0].suit.toLowerCase(), value: response.cards[0].value};
            let draw2 = {suit: response.cards[1].suit.toLowerCase(), value: response.cards[1].value};
            this.sortAndSet(draw1, draw2);
        }))
    }
    sortAndSet(draw1, draw2) {
        var currentSuits = {
            spades: this.state.spades,
            clubs: this.state.clubs,
            hearts: this.state.hearts,
            diamonds: this.state.diamonds,
        };
        for( let key in currentSuits ) {
            if(currentSuits[key].includes('QUEEN')) {
                delete currentSuits[key];
            }
        }
        if(Object.keys(currentSuits).length === 0) {
            var endTime = performance.now();
            var timeDiff = Math.round((endTime - this.timeElapsed)/1000);
            clearInterval(this.drawInterval);
            alert( 'Completed. Elapsed Time: ' + timeDiff + ' seconds');
        }
        currentSuits[draw1.suit] ?  currentSuits[draw1.suit] = [...currentSuits[draw1.suit], draw1.value].deckSort() : '';
        currentSuits[draw2.suit] ? currentSuits[draw2.suit] = [...currentSuits[draw2.suit], draw2.value].deckSort() : '';

        for(var key in currentSuits) {
            this.setState({
                [key]: currentSuits[key]
            })
        }
    }
    render() {
        return (
            <div>
                <h2> Suit of Queens {this.state.date} </h2>
                <h4> Deck ID: {this.state.deckId}</h4>
                <div>
                    <p id="spades"> SPADES: <span>{JSON.stringify(this.state.spades)}</span></p>
                    <p id="clubs"> CLUBS: <span>{JSON.stringify(this.state.clubs)}</span></p>
                    <p id="hearts"> HEARTS: <span>{JSON.stringify(this.state.hearts)}</span></p>
                    <p id="diamonds"> DIAMONDS: <span>{JSON.stringify(this.state.diamonds)}</span></p>
                </div>
            </div>
        )
    }
}