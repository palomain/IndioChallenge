import React, {Component} from 'react';
import {Tabs, Tab} from 'react-bootstrap';
import Beforeunload from 'react-beforeunload';

import CreateForm from './CreateForm.jsx';
import PreviewForm from './PreviewForm.jsx';
import ExportData from './ExportData.jsx';
import '../../public/stylesheets/page.css';

const INPUTS_KEY = "INDIO_INPUTS_CHALLENGE_DATA";

const TABS = {
    CREATE_FORM: 1,
    PREVIEW_FORM: 2,
    EXPORT_DATA: 3
};

export default class Main extends Component {

    constructor(){
        super();
        let inputs = localStorage.getItem(INPUTS_KEY);
        inputs = inputs ? JSON.parse(inputs) : null;

        this.state = {
            tab: TABS.CREATE_FORM,
            inputs
        };

        this.handleTabChange = this.handleTabChange.bind(this);
        this.saveResults = this.saveResults.bind(this);
    }

    getResult(){
        return this.refs.creator.getResult();
    }

    saveResults(){
        localStorage.setItem(INPUTS_KEY, JSON.stringify(this.getResult()));
    }

    handleTabChange(tab){
        const inputs = this.getResult();
        this.setState({tab, inputs});
    }

    render () {
        return (
            <Beforeunload onBeforeunload={this.saveResults}>
                <section>
                    <Tabs onSelect={this.handleTabChange} id="main-tabs" >
                        <Tab eventKey={TABS.CREATE_FORM} title="Create">
                            <CreateForm ref="creator" inputs={this.state.inputs}/>
                        </Tab>
                        <Tab  eventKey={TABS.PREVIEW_FORM} title='Preview'  >
                            <PreviewForm ref="previewer" inputs={this.state.inputs}/>
                        </Tab>
                        <Tab  eventKey={TABS.EXPORT_DATA} title='Export' >
                            <ExportData ref="exporter" inputs={this.state.inputs}/>
                        </Tab>
                    </Tabs>

                </section>
            </Beforeunload>
        );
    }
}