template: main-no-toc.html

<div class="logo">
  <div class="logo__logo">
    <img class="logo__image" src="/static/img/avatar.svg" alt="RedRunner" />
  </div>
  <div class="logo__text">
    <div class="logo__name">RedRunner</div>
    <div class="logo__slogan">A tiny but mighty JS framework.</div>
  </div>
</div>

<div class="info">
  <div class="pure-g">
    <div class="pure-u-1 pure-u-sm-1-2">
      <div class="info__block">
        <h2>Tiny</h2>
        <p>
          RedRunner produces absloutely tiny bundles.
        </p>
        <div class="stats_div">
          <header>Size of identical benchmark app</header>
          <div class="stats_table" id="framework_size_chart"></div>
          <footer>
            Sizes of minified and gzipped bundle of non-keyed implementations of the <a href="https://github.com/krausest/js-framework-benchmark">js-framework-benchmark</a> app.
          </footer>
        </div>
        <p>
          Tiny bundles means pages load faster, and there's less pressure to split code.
        </p>
      </div>
    </div>
    <div class="pure-u-1 pure-u-sm-1-2">
      <div class="info__block">
        <h2>Fast</h2>
        <p>
          It is also one of the fastest frameworks out there.
        </p>
        <div class="stats_div">
          <header>Results for create 10,000 rows test</header>
          <div class="stats_table" id="framework_speed_chart"></div>
          <footer>
            Geometric mean over 10 runs using non-keyed implementation of <a href="https://github.com/krausest/js-framework-benchmark">js-framework-benchmark</a> (run locally).
          </footer>
        </div>
        <p>
          But real performance is about fixing bottlenecks, which requires a level of control few frameworks give you.
        </p>
      </div>
    </div>
  </div>
</div>


<div class="info">
  <div class="pure-g">
    <div class="pure-u-1 pure-u-sm-1-2">
      <div class="info__block">
        <h2>Simple</h2>
        <p>
          RedRunner has no engine. Its syntax compiles to direct DOM updates, meaning you can take as much control as you like without breaking anything.
        </p>
      </div>
    </div>
    <div class="pure-u-1 pure-u-sm-1-2">
      <div class="info__block">
      <h2>Productive</h2>
        <p>
          The simple architecture, lack of magic, and the ability to seamlessly take control of internal operations make for an incredibly productive workflow.
        </p>
      </div>
    </div>
  </div>
</div>

<div class="call-to-action">
  <a href="/tour">Take the tour</a>
</div>


<script type="text/javascript">
  drawChart(frameworkStats, "createRows", "framework_speed_chart", "ms");
  drawChart(frameworkStats, "size", "framework_size_chart", " kB");
</script>