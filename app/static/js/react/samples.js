function Welcome(props) {
    return <h1>Hello, {props.name}</h1>;
}
  
function App() {
    return (
        <div>
        <Welcome name="Sara" />
        <Welcome name="Cahal" />
        <Welcome name="Edite" />
        </div>
    );
}
  
ReactDOM.render(
    <App />,
    document.getElementById('root')
);

class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {date: new Date()};
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }
    
    componentWillUnmount() {
        clearInterval(this.timerID);
    }
    
    tick() {
        this.setState({
            date: new Date()
        });
    }
  
    render() {
        return (
            <div>
                <h1>Hello, world!</h1>
                <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
            </div>
        );
    }
}
  
ReactDOM.render(
    <Clock />,
    document.getElementById('root')
);

// Correct
this.setState({comment: 'Hello'});


<button onClick={activateLasers}>
    Activate Lasers
</button>

function ActionLink() {
    function handleClick(e) {
        e.preventDefault();
        console.log('The link was clicked.');
    }
  
    return (
        <a href="#" onClick={handleClick}>
            Click me
        </a>
    );
}

class Toggle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isToggleOn: true};
    
        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);
    }
  
    handleClick() {
        this.setState(state => ({
            isToggleOn: !state.isToggleOn
        }));
    }
  
    render() {
        return (
            <button onClick={this.handleClick}>
            {this.state.isToggleOn ? 'ON' : 'OFF'}
            </button>
        );
    }
}
  
ReactDOM.render(
    <Toggle />,
    document.getElementById('root')
);

<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>


class LoginControl extends React.Component {
    constructor(props) {
        super(props);
        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.handleLogoutClick = this.handleLogoutClick.bind(this);
        this.state = {isLoggedIn: false};
    }
  
    handleLoginClick() {
        this.setState({isLoggedIn: true});
    }
  
    handleLogoutClick() {
        this.setState({isLoggedIn: false});
    }
  
    render() {
        const isLoggedIn = this.state.isLoggedIn;
        let button;
        if (isLoggedIn) {
            button = <LogoutButton onClick={this.handleLogoutClick} />;
        } else {
            button = <LoginButton onClick={this.handleLoginClick} />;
        }
    
        return (
            <div>
            <Greeting isLoggedIn={isLoggedIn} />
            {button}
            </div>
        );
    }
}
  
ReactDOM.render(
    <LoginControl />,
    document.getElementById('home-slider-panel-wrap')
);


function Mailbox(props) {
    const unreadMessages = props.unreadMessages;
    return (
        <div>
            <h1>Hello!</h1>
            {unreadMessages.length > 0 &&
                <h2>
                    You have {unreadMessages.length} unread messages.
                </h2>
            }
        </div>
    );
}
  
const messages = ['React', 'Re: React', 'Re:Re: React'];
ReactDOM.render(
    <Mailbox unreadMessages={messages} />,
    document.getElementById('root')
);


function WarningBanner(props) {
    if (!props.warn) {
        return null;
    }
  
    return (
        <div className="warning">
            Warning!
        </div>
    );
}
  
class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showWarning: true};
        this.handleToggleClick = this.handleToggleClick.bind(this);
    }
  
    handleToggleClick() {
        this.setState(state => ({
            showWarning: !state.showWarning
        }));
    }
  
    render() {
        return (
            <div>
                <WarningBanner warn={this.state.showWarning} />
                <button onClick={this.handleToggleClick}>
                    {this.state.showWarning ? 'Hide' : 'Show'}
                </button>
            </div>
        );
    }
  }
  
ReactDOM.render(
    <Page />,
    document.getElementById('root')
);