var ContinuousActuator = React.createClass({
    getInitialState: function() {
        return({loading: false});
    },
    handleSubmit: function(event) {
        event.preventDefault();
        this.setState({loading: true});
        var value = parseFloat(this.refs.value.getDOMNode().value.trim());
        if (!isNaN(value)) {
            console.log("new value", value);
            var req = {uuid: this.props.uuid, request: value};
            console.log(req);
            this.socket.emit('actuate', req);
        }
        setTimeout(function() {
            this.setState({loading: false});
            this.refs.value.getDOMNode().value = '';
        }.bind(this), 2000);
    },
    componentWillMount: function() {
        this.socket = io.connect();
    },
    render: function() {
        return(
            <div className="continuousActuator">
                <form onSubmit={this.handleSubmit} >
                  <input type="text" ref="value" />
                  { !this.state.loading ?  <input type="submit" value="Override" /> : <label>Loading...</label> }
                </form>
            </div>
        );
    }
});


/*
 * This will render two buttons, one for "on" and one for "off". Clicking a button
 * will result in a POST request being performed. the required props are
 *
 * @onUrl: URL that is POSTed when the "on" button is pushed
 * @onLabel: label for the "on" button
 * @onData: data for the POST request when "on" is pushed
 *
 * @offUrl: URL that is POSTed when the "off" button is pushed
 * @offLabel: label for the "off" button
 * @offData: data for the POST request when "off" is pushed
 *
 * State:
 * @on: if @on is 1, then the "on" will be depressed (the bootstrap "active" prop), else the "off" button will be depressed
 */
var BinaryActuator = React.createClass({
    getInitialState: function() {
        return({on: false,
                loading: false});
    },
    handleClick: function(e) {
        event.preventDefault();
        this.setState({loading: true});
        var targetState = e.target.getAttribute('data-buttontype') == 'on' ? 1 : 0;
        console.log(targetState);
        var req = {uuid: this.props.uuid, request: targetState};
        this.socket.emit('actuate', req);
        setTimeout(function() {
            this.setState({loading: false});
        }.bind(this), 2000);
    },
    componentWillMount: function() {
        this.socket = io.connect();
    },
    render: function() {
        var Button = ReactBootstrap.Button;
        var ButtonToolbar = ReactBootstrap.ButtonToolbar;
        var onActive = this.state.on;
        var offActive = !this.state.on;
        return(
            <div className="binaryActuator">
                <ButtonToolbar>
                    <Button bsStyle="success" 
                            disabled={this.state.loading} 
                            active={onActive} 
                            data-buttontype="on"
                            onClick={!this.state.loading ? this.handleClick : null}>
                    {this.state.loading ? 'Loading...' : this.props.onLabel}
                    </Button>

                    <Button bsStyle="danger" 
                            disabled={this.state.loading} 
                            active={offActive} 
                            data-buttontype="off"
                            onClick={!this.state.loading ? this.handleClick : null}>
                    {this.state.loading ? 'Loading...' : this.props.offLabel}
                    </Button>
                </ButtonToolbar>
            </div>
        );
    }
});