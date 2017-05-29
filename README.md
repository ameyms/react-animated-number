# react-animated-number
[![npm version](https://badge.fury.io/js/react-animated-number.svg)](http://badge.fury.io/js/react-animated-number)
[![devDependency Status](https://david-dm.org/ameyms/react-animated-number/dev-status.svg)](https://david-dm.org/ameyms/react-animated-number#info=devDependencies)

React component for animating numbers

## Install
react-animated-number is available via npm and can be used with [browserify](http://browserify.org/) or [webpack](https://webpack.github.io/).

```
npm install --save react-animated-number
```
## Usage

```js
import AnimatedNumber from 'react-animated-number';
...
...

class Demo extends Component {

    ...

    render () {
        <AnimatedNumber component="text" value={bigValue}
            style={{
                transition: '0.8s ease-out',
                fontSize: 48,
                transitionProperty:
                    'background-color, color, opacity'
            }}
            frameStyle={perc => (
                perc === 100 ? {} : {backgroundColor: '#ffeb3b'}
            )}
            duration={300}
            formatValue={n => prettyBytes(n)}/>
    }
}
```
## API

#### value: number
**required**<br/>
Numeric value to which to tween to

----
#### initialValue: number
**default**: `0`<br/>
Initial numeric value for the tween start

----

#### component: any
**default**: `"span"`<br/>
This is similar to the react transition [API](https://facebook.github.io/react/docs/animation.html#rendering-a-different-component). By default, renders text inside a `<span>`. You can pass in any valid `ReactElement`. Use `"text"` for rendering into SVG.

----

#### formatValue: ?(n: number) => string
A callback function that accepts a number and returns a formatted string

----

#### duration: ?number
**default**: `300`<br/>
Total duration of animation in milliseconds

----


#### frameStyle: ?(perc: number) => Object | void,
A callback function that accepts the percentage of completion of current animation and returns the style object to applied to the current frame

----

#### stepPrecision: ?number
The number of decimal places to render for intermediate values.
If set to `0`, rounds off the intermediate values using `Math.round`


<br/>


## Demo
A demo can be found [here](http://ameyms.com/react-animated-number/).
Source code for the demo can be found [here](https://github.com/ameyms/react-animated-number/blob/master/example/demo.jsx).

## License
react-animated-number is licensed under MIT license.
