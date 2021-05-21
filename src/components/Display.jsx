import React from 'react';

export default class Display extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        output: this.props.output
        }
    }

    componentWillReceiveProps(nextProps) {
        const { output } = nextProps
        this.setState({
        output
        })
    }

    render() {
        return(<div id="display">
            {this.state.output}
        </div>);
    }
}