import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import prettyBytes from 'pretty-bytes';
import AnimatedNumber from 'react-animated-number';

const getRandomInt = (min, max) => (Math.floor(Math.random() * (max - min + 1)) + min);

class Demo extends Component {

    static displayName = 'Demo'

    constructor() {
        super();

        this.state = {
            smallValue: 10,
            bigValue: 1024
        };
    }

    componentDidMount() {
        this.interval = setInterval(() => this.update(), 2000);
    }

    update() {
        this.setState({
            smallValue: getRandomInt(10, 20),
            bigValue: getRandomInt(1024, Math.pow(1024, 4))
        });
    }

    render() {
        const {smallValue, bigValue} = this.state;

        return (
            <div style={{marginTop: 50}}>
                <h4>
                    <AnimatedNumber
                        style={{
                            transition: '0.8s ease-out',
                            transitionProperty:
                                'background-color, color'
                        }}
                        frameStyle={perc => (
                            perc === 100 ? {} : {backgroundColor: '#ffeb3b'}
                        )}
                        value={smallValue}
                        format={n => `Animated numbers are ${n} ` +
                            'times more awesome than regular ones'}/>
                </h4>
                <div className="alert alert-info">
                    <AnimatedNumber
                        style={{
                            transition: '0.8s ease-out',
                            transitionProperty:
                                'background-color, color, opacity'
                        }}
                        frameStyle={perc => (
                            perc === 100 ? {} : {opacity: 0.25}
                        )}
                        value={bigValue}
                        format={n => `You can format numbers like ${n} ` +
                            `to ${prettyBytes(n)}`}/>
                </div>


                <div>
                    <div>
                        {'And you can even render inside SVG'}
                    </div>
                    <svg width={300} height={300}>
                        <g transform="translate(30,60)">
                            <AnimatedNumber
                                style={{
                                    transition: '0.8s ease-out',
                                    fontSize: 48,
                                    transitionProperty:
                                        'background-color, color, opacity'
                                }}
                                frameStyle={perc => (
                                    perc === 100 ? {} : {opacity: 0.25}
                                )}
                                value={bigValue}
                                component="text"
                                format={n => prettyBytes(n)}/>
                        </g>
                    </svg>
                </div>
            </div>
        );
    }
}


ReactDOM.render(<Demo />, document.getElementById('appRoot'));
