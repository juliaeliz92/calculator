import React from 'react';

export default class Cell extends React.Component {
    render() {
        const { label, cellId } = this.props;
        return(
        <div className="cell" id={cellId} onClick={this.props.clickCellAction}>
            {label}
        </div>
        );
    }
}