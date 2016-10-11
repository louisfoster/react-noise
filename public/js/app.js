function inOut(input, output) {
  return React.Children.map(input, child => {
    return React.cloneElement(child, {
      out: output
    });
  });
}

let BQFilter = React.createClass({
  render: function() {
    let bqf = this.props.context.createBiquadFilter();
    bqf.type = this.props.type;
    bqf.frequency.value = this.props.freq;
    bqf.gain.value = this.props.gain;
    let inputs = inOut(this.props.children, bqf);
    bqf.connect(this.props.out);
    return (
      <div>
        <p>Attached to filter</p>
        {inputs}
      </div>
    );
  }
});

let Osc = React.createClass({
  render: function() {
    let osc = this.props.context.createOscillator();
    osc.frequency.value = this.props.freq;
    osc.connect(this.props.out);
    osc.start();
    return (
      <div>
        <p>Oscillator rendered</p>
        <p>Oscillator frequency: {this.props.freq}</p>
      </div>
    );
  }
})

let Out = React.createClass({
  render: function() {
    let dest = this.props.context.destination;
    let inputs = inOut(this.props.children, dest);
    return (
      <div>
        <p>Audio destination rendered</p>
        {inputs}
      </div>
    );
  }
});

let Context = React.createClass({
  render: function() {
    return (
      <div>
        <p>Audio context rendered</p>
        <Out {...this.props}>
          <BQFilter {...this.props} type='lowshelf' freq={100} gain={-20}>
            <Osc {...this.props} freq={60} />
          </BQFilter>
        </Out>
      </div>
    );
  }
});

let Audio = React.createClass({
  render: function() {
    let audioCtx = new AudioContext();
    return (
      <Context context={audioCtx} />
    )
  }
});

ReactDOM.render(
  <Audio />,
  document.getElementById('content')
);
