import React, {Component} from 'react';
import '../../public/stylesheets/export-data.css';

class ExportData extends Component {

    /*constructor(){
        super();
        this.state = {
            output : ''
        };
    }

    updateOutput(output) {
       this.setState({output});
    }*/

    render() {
        return (
            <div className="export-data">
                <textarea className="export-data-text"  value={JSON.stringify(this.props.inputs)} disabled/>
            </div>
        );
    }
}

export default ExportData;
