import React, {Component} from 'react';
import {Button} from 'react-bootstrap';
import FormInput from './FormInput.jsx';
import '../../public/stylesheets/create-form.css';
import {uniqueId} from 'lodash';

class CreateForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            inputs : props.inputs
        };

        this.handleAddInput = this.handleAddInput.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleAddInput(){
        let inputs = this.state.inputs;
        inputs.push({});
        this.setState({inputs});
    }

    handleDelete(id){
        let inputs = this.state.inputs;
        let index = inputs.findIndex((input=>input.id===id));
        inputs.splice(index, 1);
        this.setState({inputs});
    }

    getResult(){
        return this.state.inputs.map(input=>this.refs[input.id].getResult());
    }

    render() {
        return (
            <div className="create-form">
                {this.state.inputs.map(input=>{
                    input.id = input.id || uniqueId("input");
                    return < FormInput
                        handleDelete={()=>this.handleDelete(input)}
                        ref={input.id}
                        key={input.id}
                        {...input}
                    />
                })}
                <Button bsStyle="primary" onClick={this.handleAddInput}>Add Input</Button>
            </div>
        );
    }
}



export default CreateForm;
