import React, {Component} from 'react';
import {Form, FormGroup, FormControl, ControlLabel, Button, Col} from 'react-bootstrap';
import '../../public/stylesheets/form-input.css';
import {uniqueId} from 'lodash';

class FormInput extends Component {
    constructor(props){
        super(props);
        const conditionType =  props.conditionType;

        this.state = {
            condition: props.condition ? props.condition : conditionType ? {
                matchingType : conditionType.matchingOptions[0] ,
                matchingValue :  conditionType.defaultValue
            } : null ,
            children : props.children || [],
            question : props.question || '',
            type : props.type || QUESTION_TYPES.TEXT
        };

        this.handleAddSubInput = this.handleAddSubInput.bind(this);
        this.handleTypeChanged = this.handleTypeChanged.bind(this);
        this.handleQuestionChanged = this.handleQuestionChanged.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleMatchingValueChanged = this.handleMatchingValueChanged.bind(this);
        this.handleMatchingTypeChanged = this.handleMatchingTypeChanged.bind(this);
    }

    handleAddSubInput(){
        let children = this.state.children;
        children.push({});
        this.setState({children});
    }

    handleDelete(id) {
        let children = this.state.children;

        let index = children.findIndex(child=>child.id===id);
        children.splice(index, 1);
        this.setState({children});
    }

    handleQuestionChanged(e){
        let question = e.target.value;

        this.setState({question});
    }

    handleTypeChanged(e){
        let type = e.target.value;
        
        this.setState({type});
    }
    
    handleMatchingTypeChanged(e) {
        let matchingType = e.target.value;
        let matchingValue = this.state.condition.matchingValue;
        if(CONDITION_TYPES[this.state.type].defaultValue){
            matchingValue = CONDITION_TYPES[matchingType].defaultValue;
        }

        this.setState({condition:{matchingType, matchingValue}});
    }

    handleMatchingValueChanged(e){
        let matchingValue = e.target.value;
        let warnMessage = '';
        if(this.props.conditionType.validator && !this.props.conditionType.validator(matchingValue)){
            warnMessage = this.props.conditionType.invalidTypeMessage;
        }

        let matchingType = this.state.condition.matchingType;
        this.setState({condition:{matchingType, matchingValue}, warnMessage});
    }


    getResult(){

        let result = {
            question: this.state.question,
            type: this.state.type
        };

        if(this.state.condition) {
            result.condition = this.state.condition;
        }

        if(this.state.children.length) {
             result.children = this.state.children.map(child=>this.refs[child.id].getResult());
        }

        return result;
    }

    renderOptions(options){
        return options.map(val=>{
            return <option key={val} value={val}>{val}</option>;
        })
    }

    render() {
        const condition = this.props.conditionType;
        const conditionMarkup = condition ?
            <FormGroup>
                <Col sm={2}><ControlLabel >Condition</ControlLabel></Col>
                <Col sm={5}>
                    <FormControl componentClass="select" 
                                 value={this.state.condition.matchingType}
                                 onChange={this.handleMatchingTypeChanged}
                    >
                    {
                        this.renderOptions(condition.matchingOptions)
                    }
                    </FormControl >
                </Col>
                <Col sm={5}>
                    <FormControl componentClass={condition.inputType}
                                 value={this.state.condition.matchingValue}
                                 onChange={this.handleMatchingValueChanged}
                                 type={condition.valueType}
                                 placeholder={condition.placeholder}>
                    {
                        condition.valueOptions && this.renderOptions(condition.valueOptions)
                    }
                    </FormControl>
                    <small className="warn-message">{this.state.warnMessage}</small>
                </Col>

            </FormGroup> : '' ;

        const questionTypes = Object.values(QUESTION_TYPES);

        return (
            <div className="form-container">
                <Form horizontal className="form-box">

                    {conditionMarkup}
                    <FormGroup
                        controlId="question"

                    >

                        <Col sm={2}><ControlLabel>Question</ControlLabel></Col>
                        <Col  sm={10}><FormControl

                            type="text"
                            value={this.state.question}
                            placeholder="Enter question"
                            onChange={this.handleQuestionChanged}
                        /></Col>
                    </FormGroup>
                    <FormGroup controlId="type">
                        <Col sm={2}> <ControlLabel>Type</ControlLabel></Col>
                        <Col sm={10}><FormControl
                            componentClass="select"
                            type="select"
                            value={this.state.type}

                            onChange={this.handleTypeChanged}
                            disabled={!!this.state.children.length}
                        >
                            {
                                this.renderOptions(questionTypes)
                            }
                        </FormControl></Col>

                    </FormGroup>
                    <div className="input-buttons">
                        <Button bsStyle="primary" onClick={this.handleAddSubInput}>Add Sub-Input</Button>
                        <Button bsStyle="danger" onClick={this.props.handleDelete} >Delete</Button>
                    </div>
                </Form>

                <div className="children-inputs" >
                    {
                        this.state.children.map(child=>{
                            child.id = child.id || uniqueId("subinput");
                            return <FormInput conditionType={CONDITION_TYPES[this.state.type]}
                                              handleDelete={()=>this.handleDelete(child.id)}
                                              ref={child.id}
                                              key={child.id}
                                              {...child}
                            />
                        })
                    }

                </div>

            </div>
        );

    }
}

FormInput.propTypes = {};
FormInput.defaultProps = {};

export default FormInput;

export const QUESTION_TYPES = {
    TEXT : "Text",
    NUMBER : "Number",
    YES_NO : "Yes/No",
};

export const MATCHING_TYPES = {
    EQUALS:  "Equals",
    GREATER_THAN: "Greater than",
    LESS_THAN: "Less than"
};

export const MATCHING_TYPES_EVALUATORS = {
    [MATCHING_TYPES.EQUALS] : (input, matchingValue) => input.length && input === matchingValue ,
    [MATCHING_TYPES.GREATER_THAN] : (input, matchingValue) => input.length && +input > +matchingValue ,
    [MATCHING_TYPES.LESS_THAN] : (input, matchingValue) => input.length && +input < +matchingValue
};

export const CONDITION_TYPES = {

    [QUESTION_TYPES.TEXT]: {
        inputType : "input",
        valueType : "text",
        placeholder: "Value to match",
        matchingOptions :  [MATCHING_TYPES.EQUALS]
    } ,
    [QUESTION_TYPES.NUMBER]:{
        inputType : "input",
        valueType : "text",
        placeholder: "Number to match",
        matchingOptions: [MATCHING_TYPES.EQUALS, MATCHING_TYPES.GREATER_THAN, MATCHING_TYPES.LESS_THAN],
        validator : val => !isNaN(val),
        invalidTypeMessage: "Input is not a number"
    },
    [QUESTION_TYPES.YES_NO]: {
        inputType: "select",
        valueType: "select",
        matchingOptions: [MATCHING_TYPES.EQUALS],
        valueOptions: ["Yes", "No"],
        defaultValue : "Yes"
    }
};
