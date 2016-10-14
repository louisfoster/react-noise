function inOut(input, output) {
  return React.Children.map(input, child => {
    return React.cloneElement(child, {
      out: output
    });
  });
}

let Gain0 = React.createClass({
  render: function() {
    let gain = this.props.context.createGain();
    gain.gain.value = 15;
    let inputs = inOut(this.props.children, gain);
    gain.connect(this.props.out);
    return (
      <div>
        <p>Attached gain</p>
        {inputs}
      </div>
    );
  }
});

let Compressor0 = React.createClass({
  render: function() {
    let compressor = this.props.context.createDynamicsCompressor();
    compressor.threshold.value = -50;
    compressor.knee.value = 13;
    compressor.ratio.value = 15;
    compressor.attack.value = 0;
    compressor.release.value = 1;
    let inputs = inOut(this.props.children, compressor);
    compressor.connect(this.props.out);
    return (
      <div>
        <p>Attached compressor</p>
        {inputs}
      </div>
    );
  }
});

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

let WhiteNoise = React.createClass({
  render: function() {
    const channels = 2;
    const frameCount = this.props.context.sampleRate * 0.1;
    const arrayBuffer = this.props.context.createBuffer(channels, frameCount,
      54321);
    for (let c = 0; c < channels; c++) {
       let buffering = arrayBuffer.getChannelData(c);
       for (let i = 0; i < frameCount; i++) {
         buffering[i] = (Math.random() * 2 - 1) * 0.485;
       }
    }
    let source = this.props.context.createBufferSource();
    source.buffer = arrayBuffer;
    source.loop = true;
    source.detune.value = 1845;
    source.connect(this.props.out);
    source.start();
    return (
      <div>
        <p>Generating white noise</p>
      </div>
    )
  }
});

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
          <Gain0 {...this.props}>
            <Compressor0 {...this.props}>
              <Distortion0 {...this.props}>
                <BQFilter0 {...this.props} type='highshelf' freq={550} gain={-35}>
                  <Compressor0 {...this.props}>
                    <Distortion0 {...this.props}>
                      <Compressor0 {...this.props}>
                        <Distortion0 {...this.props}>
                          <BQFilter0 {...this.props} type='lowshelf' freq={440} gain={5}>
                              <BQFilter0 {...this.props} type='lowshelf' freq={40} gain={-35}>
                                <Osc0 {...this.props} freq={8} type='triangle' />
                              </BQFilter0>
                            <BQFilter0 {...this.props} type='lowpass' freq={320} gain={2}>
                              <BQFilter0 {...this.props} type='lowpass' freq={600} gain={4}>
                                <BQFilter0 {...this.props} type='lowpass' freq={1000} gain={6}>
                                  <WhiteNoise {...this.props} />
                                  <WhiteNoise {...this.props} />
                                </BQFilter0>
                              </BQFilter0>
                            </BQFilter0>
                          </BQFilter0>
                        </Distortion0>
                      </Compressor0>
                    </Distortion0>
                  </Compressor0>
                </BQFilter0>
              </Distortion0>
            </Compressor0>
          </Gain0>
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
