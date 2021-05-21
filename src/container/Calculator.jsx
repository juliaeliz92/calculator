import React from 'react';
import Cell from './../components/Cell.jsx';
import Display from './../components/Display';
import { keys, types } from './../constants/constants';

export default class Calculator extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        input : [],
        output: 0
      }
    }
    
    pushToInput = (cell) => {
      let { input } = this.state;
      let output = "";
      let length = input.length;
      if(cell.type === types.INPUT) {
        if(length > 0 && input[length - 1].type === types.INPUT)  {
           input[length - 1].value = input[length - 1].value * 10 + cell.value;
        } else if(length > 0 && input[length - 1].type === types.DECIMAL) {
          const dec = input[length - 1].value.split(".");
          const [first, second] = dec;
          input[length - 1].value = first + '.' + second;
          if(dec.length >= 3) {
            for(let i = 2; i < dec.length; ++i) {
              input[length - 1].value = input[length - 1].value + "" + dec[i];
            }     
          }
          input[length - 1].value = parseFloat(input[length - 1].value + cell.value);   
          if(Number.isInteger(input[length - 1].value))
            input[length - 1].value = input[length - 1].value.toFixed(1);
        } else {
          input.push({
            value: cell.value,
            type: cell.type
          });
        }
      } else if(length > 0 && cell.type === types.DECIMAL) {      
        input[length - 1].type = types.DECIMAL;
        input[length - 1].value = input[length - 1].value.toString().concat('.');
      } else if(cell.type === types.OPERATOR) {
        let { type, value } = cell;   
        input.push({
          value,
          type
        });
      } else if (cell.type === types.COMPUTE) {
        let opr1 = null, opr2 = null, op = null, negate = false, result = 0;
        for(let i = 0; i < input.length; i++) {
          if((input[i].type === types.INPUT || input[i].type === types.DECIMAL) && !opr1)
            opr1 = input[i].value;
          else if(input[i].type === types.OPERATOR) {
            if(!op)
              op = input[i].value;
            else if(input[i].value === '-' && (input[i + 1].type === types.INPUT || input[i + 1].type === types.DECIMAL) && ((length > 0 && input[i - 1].type === types.OPERATOR) || length === 0)) {
              negate = true;
            } else {
              op = input[i].value;
              negate = false;
            }
          }
          else if((input[i].type === types.INPUT || input[i].type === types.DECIMAL) && opr1 && !opr2)
            opr2 = negate ? -input[i].value : input[i].value;
          if(opr1 && opr2 && op) {
            switch(op){
           case "+": 
             result = opr1 + opr2;
             break;
           case "-": 
             result = opr1 - opr2;
             break;
           case "*": 
             result = opr1 * opr2;
             break;
           case "/": 
             result = opr1 / opr2;
             break;
           default: 
             result = 0;
             break;
            }
            opr1 = result;
            opr2 = null;
          }
        }     
        output = result;
        let type = types.INPUT;
        if(!Number.isInteger(result)) {
           type = types.DECIMAL;
        }
        input = [{
          type,
          value: result
        }]
      } else if(cell.type === types.CLEAR) {
        input = [];
        output = 0;
      }
      if(output === "")
      input.map(i => output += i.value);
      this.setState({
        input,
        output
      });
    }
    
    render() {
      const { output } = this.state;
      return(<div id="main">
        <div id="display-clear-row">
          <Display output={output}/>
          <Cell cellId={types.CLEAR} label="C" type={types.CLEAR} clickCellAction={() => this.pushToInput({type: types.CLEAR})} />
        </div>
        <div id="cell-container">
          {keys.map(cell => 
            (<Cell
               cellId={cell.id}
               label={cell.value}
               type={cell.type} 
               value={cell.value} 
               clickCellAction={() => this.pushToInput(cell)}
             />)         
          )}
        </div>
      </div>);
    }
}