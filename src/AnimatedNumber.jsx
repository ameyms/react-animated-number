/* @flow */
import React, {Component, PropTypes} from 'react';

const ANIMATION_DURATION: number = 300;

type AnimatedNumberProps = {
    component: any,
    format: ?(n: number) => number,
    value: number,
    duration: ?number,
    frameDuration: ?number,
    frameStyle: ?(perc: number) => Object | void,
    stepPrecision: ?number,
    style: any
};

export default class AnimatedNumber extends Component {


    totalFrames: number;
    tweenStep: number;
    tweenInterval: number;
    state: {
        currentValue: number;
        frame: number;
    };
    props: AnimatedNumberProps;



    static propTypes = {
        component: PropTypes.any,
        format: PropTypes.func,
        value: PropTypes.number.isRequired,
        duration: PropTypes.number,
        frameDuration: PropTypes.number,
        frameStyle: PropTypes.func,
        stepPrecision: PropTypes.number,
        style: PropTypes.object
    }

    static defaultProps = {
        component: 'span',
        format: n => n,
        duration: ANIMATION_DURATION,
        frameDuration: 16,
        stepPrecision: 2,
        frameStyle: () => ({})
    }

    constructor() {
        super();
        this.state = {
            currentValue: 0,
            frame: 0
        };
    }

    componentDidMount() {
        this.prepareTween(this.props);
    }

    componentWillReceiveProps(nextProps: AnimatedNumberProps) {

        if (+this.state.currentValue === +nextProps.value) {
            return;
        }

        if (this.tweenInterval) {
            this.endTween();
        }

        this.prepareTween(nextProps);
    }

    prepareTween({value, duration, frameDuration}) {

        const {currentValue} = this.state;

        this.totalFrames = Math.ceil(duration / frameDuration) + 1;
        this.tweenStep = (value - currentValue) / (this.totalFrames);

        this.tweenInterval = setInterval(() => this.tweenValue(1), 16);

    }

    endTween() {
        clearInterval(this.tweenInterval);
        this.setState({
            currValue: this.props.value,
            frame: 0
        });
    }

    tweenValue() {
        const {stepPrecision, value} = this.props;
        let {frame = 0, currentValue = 0} = this.state;

        currentValue = +currentValue;

        if (currentValue === value) {
            this.endTween();
            return;
        }

        currentValue = currentValue + this.tweenStep;

        if (stepPrecision) {
            currentValue = currentValue.toFixed(stepPrecision);
        } else if (this.tweenStep < 0) {
            currentValue = Math.floor(currentValue);
        } else if (this.tweenStep > 0) {
            currentValue = Math.ceil(currentValue);
        }

        if (this.tweenStep < 0) {
            currentValue = Math.max(value, currentValue);
        } else if (this.tweenStep > 0) {
            currentValue = Math.min(value, currentValue);
        }

        frame = frame + 1;

        if (currentValue === value) {
            frame = this.totalFrames;
            this.endTween();
        }


        this.setState({currentValue, frame});
    }

    render() {
        const {format, frameStyle} = this.props;
        const {frame, currentValue} = this.state;

        let {style} = this.props;
        const currStyle = frameStyle((frame / this.totalFrames) * 100);

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
            {...this.props, style},
            format(currentValue)
        );
    }


}
