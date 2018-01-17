import React, {Component} from 'react';
import InputPreview from './InputPreview.jsx';
import {uniqueId} from 'lodash';

class PreviewForm extends Component {

    render() {
        const inputs = this.props.inputs;
        const id = uniqueId('inputpreview');
        return (
            <div className="preview-form">
                {
                    inputs.map((inputData, i)=><InputPreview key={id+i} inputData={inputData} />)
                }

            </div>
        );
    }
}

export default PreviewForm;
