import React, {Component} from 'react';
import {FormGroup, FormControl, ControlLabel, Radio} from 'react-bootstrap';
import {QUESTION_TYPES, CONDITION_TYPES, MATCHING_TYPES_EVALUATORS} from './FormInput.jsx';
import {uniqueId} from 'lodash';
import '../../public/stylesheets/input-preview.css';

class InputPreview extends Component {

    constructor(props){
        super(props);
        this.state = {
            subinputs : [],
            inputValue : ''
        };

        this.processInput = this.processInput.bind(this);
    }

    processInput(value, inputData) {


        value = value.trim();
        const subinputs = [];
        let warnMessage = '';
        let validator = CONDITION_TYPES[inputData.type].validator;
        if(validator && !validator(value)) {
            warnMessage = CONDITION_TYPES[inputData.type].invalidTypeMessage;
        }

        if(inputData.children.length) {
            for(let child of inputData.children){
                let matchingType = child.condition.matchingType;
                let matchingValue = child.condition.matchingValue;
                let isMatch = MATCHING_TYPES_EVALUATORS[matchingType](value,matchingValue);
                if(isMatch){
                    subinputs.push(child);
                }
            }
        }

        this.setState({subinputs, inputValue:value, warnMessage});
    }

    resetInput(){
        this.setState({subinputs:[], inputValue:''});
    }

    renderInput(inputData){
        const type = inputData.type;
        let component = null;

        let processFn = (e)=>this.processInput(e.target.value, inputData);

        if(type ===  QUESTION_TYPES.TEXT || type === QUESTION_TYPES.NUMBER ) {
            component = <FormControl type="text" onChange={processFn} value={this.state.inputValue}>

            </FormControl>;
        } else {
            let name = uniqueId("radioGroup");
            component = <FormGroup>
                {CONDITION_TYPES[QUESTION_TYPES.YES_NO].valueOptions.map((option, i)=>{
                    return <Radio name={name}
                                  key={name+i}
                                  value={option}
                                  onClick={processFn}
                                  checked={option === this.state.inputValue}
                                  inline>
                        {option}
                    </Radio>
                })}
            </FormGroup>
        }

        return <FormGroup>
            <ControlLabel>{inputData.question}</ControlLabel>
            {component}
            <small className="warn-message">{this.state.warnMessage}</small>
        </FormGroup>
    }

    render() {

        const inputs = this.state.subinputs || [];

        return (
            <div className="input-preview">
                <form>
                    {this.renderInput(this.props.inputData)}
                    {
                        inputs.map((inputData,i) => <InputPreview key={"subinput"+i} inputData={inputData} />)
                    }

                </form>

            </div>
        );
    }
}

InputPreview.propTypes = {};
InputPreview.defaultProps = {};

export default InputPreview;
