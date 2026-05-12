import React, {Component} from 'react';
import PropTypes from 'prop-types';
import raf from 'raf';

const ANIMATION_DURATION: number = 300;

type AnimatedNumberProps = {
    component: any,
    formatValue: ?(n: number) => string,
    value: number,
    initialValue: number,
    duration: ?number,
    frameStyle: ?(perc: number) => Object | void,
    stepPrecision: ?number,
    style: any
};

export default class AnimatedNumber extends Component {

    totalFrames: number;
    tweenStep: number;
    tweenHandle: number;
    state: {
        currentValue: number;
        frame: number;
    };
    props: AnimatedNumberProps;



    static propTypes = {
        component: PropTypes.any,
        formatValue: PropTypes.func,
        value: PropTypes.number,
        initialValue: PropTypes.number,
        duration: PropTypes.number,
        frameStyle: PropTypes.func,
        stepPrecision: PropTypes.number,
        style: PropTypes.object,
        className: PropTypes.string
    }

    static defaultProps = {
        component: 'span',
        formatValue: n => n,
        initialValue: 0,
        duration: ANIMATION_DURATION,
        frameStyle: () => ({}),
        value: 0,
    }

    constructor(props) {
        super(props);
        this.state = {
            currentValue: props.initialValue
        };
    }

    componentDidMount() {
        this.prepareTween(this.props);
    }

    componentWillReceiveProps(nextProps: AnimatedNumberProps) {

        if (this.state.currentValue === nextProps.value) {
            return;
        }

        if (this.tweenHandle) {
            this.endTween();
        }

        this.prepareTween(nextProps);
    }

    componentWillUnmount() {
        this.cancelTween();
    }

    prepareTween() {
        this.tweenHandle = raf((timestamp) => {
            this.tweenValue(timestamp, true);
        });

    }

    cancelTween() {
        if (this.tweenHandle) {
            raf.cancel(this.tweenHandle);
            this.tweenHandle = null;
        }
    }

    endTween() {
        this.cancelTween();
        this.setState({
            currentValue: this.props.value
        });
    }

    ensureSixtyFps(timestamp) {

        const {currentTime} = this.state;

        return !currentTime || (timestamp - currentTime > 16);
    }

    tweenValue(timestamp, start) {

        if (!this.ensureSixtyFps(timestamp)) {
            this.tweenHandle = raf(this.tweenValue.bind(this));
            return;
        }

        const {value, duration} = this.props;

        const {currentValue} = this.state;
        const currentTime = timestamp;
        const startTime = start ? timestamp : this.state.startTime;
        const fromValue = start ? currentValue : this.state.fromValue;
        if (currentTime - startTime >= duration) {
            this.tweenHandle = null;
            this.setState({
                currentValue: value,
                startTime,
                fromValue,
                currentTime
            });
            return;
        }

        const newValue = fromValue + (
            (value - fromValue) * ((currentTime - startTime) / duration)
        );

        this.setState({
            currentValue: newValue,
            startTime: startTime ? startTime : currentTime,
            fromValue, currentTime
        });
        this.tweenHandle = raf(this.tweenValue.bind(this));
    }

    render() {
        const {formatValue, value, className, frameStyle, stepPrecision} = this.props;
        const {currentValue, fromValue} = this.state;

        let {style} = this.props;
        let adjustedValue: number = currentValue;
        const direction = value - fromValue;

        if (currentValue !== value) {
            if (stepPrecision > 0) {
                adjustedValue = Number(currentValue.toFixed(stepPrecision));
            } else if (direction < 0 && stepPrecision === 0) {
                adjustedValue = Math.floor(currentValue);
            } else if (direction > 0 && stepPrecision === 0) {
                adjustedValue = Math.ceil(currentValue);
            }
        }

        const perc = Math.abs((adjustedValue - fromValue) / (value - fromValue) * 100);

        const currStyle: (Object | null) = frameStyle(perc);

        if (style && currStyle) {
            style = {
                ...style,
                ...currStyle
            };
        } else if (currStyle) {
            style = currStyle;
        }

        return React.createElement(
            this.props.component,
            {...filterKnownProps(this.props), className, style},
            formatValue(adjustedValue)
        );
    }
}

function filterKnownProps(props) {
    const sanitized = {};
    const propNames = Object.keys(props);
    const validProps = Object.keys(AnimatedNumber.propTypes);

    propNames.filter(p => validProps.indexOf(p) < 0).forEach(p => {
        sanitized[p] = props[p];
    });

    return sanitized;
};
