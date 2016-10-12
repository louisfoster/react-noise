function inOut(input, output) {
  return React.Children.map(input, child => {
    return React.cloneElement(child, {
      out: output
    });
  });
}

let Distortion0 = React.createClass({
  render: function() {
    let distort = this.props.context.createWaveShaper();
    var k = 800,
      n_samples = 10,
      curve = new Float32Array(n_samples),
      deg = Math.PI / (Math.random() * 100),
      i = 0,
      x;
    for ( ; i < n_samples; ++i ) {
      x = i * 2 / n_samples - 1;
      curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) ) *
        Math.random() * 2 * Math.pow(2, Math.random());
    }
    distort.curve = curve;
    distort.oversample = '4x';
    let inputs = inOut(this.props.children, distort);
    distort.connect(this.props.out);
    return (
      <div>
        <p>Attached to distortion filter</p>
        {inputs}
      </div>
    );
  }
});

let BQFilter0 = React.createClass({
  render: function() {
    let bqf = this.props.context.createBiquadFilter();
    bqf.type = this.props.type;
    bqf.frequency.value = this.props.freq;
    bqf.gain.value = this.props.gain;
    let inputs = inOut(this.props.children, bqf);
    bqf.connect(this.props.out);
    return (
      <div>
        <p>Attached to BQ Filter</p>
        {inputs}
      </div>
    );
  }
});

let Osc0 = React.createClass({
  render: function() {
    let osc = this.props.context.createOscillator();
    osc.frequency.value = this.props.freq;
    osc.type = this.props.type;
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

let Out0 = React.createClass({
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
        <Out0 {...this.props}>
          <BQFilter0 {...this.props} type='highshelf' freq={300} gain={-25}>
            <Distortion0 {...this.props}>
              <Distortion0 {...this.props}>
                <BQFilter0 {...this.props} type='lowshelf' freq={100} gain={-10}>
                  <Osc0 {...this.props} freq={40} type='triangle' />
                </BQFilter0>
              </Distortion0>
            </Distortion0>
          </BQFilter0>
        </Out0>
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

ReactDOM.render(<Audio />, document.getElementById('content'));
