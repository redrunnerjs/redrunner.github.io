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
          RedRunner and Svelte both use compilation to hit those sizes, but differ in just about every other <a href="/read/design">design</a> choice.
        </p>
      </div>
    </div>
    <div class="pure-u-1 pure-u-sm-1-2">
      <div class="info__block">
        <h2>Fast</h2>
        <p>
          It is also among the fastest frameworks out there.
        </p>
        <div class="stats_div">
          <header>Results for create 10,000 rows test</header>
          <div class="stats_table" id="framework_speed_chart"></div>
          <footer>
            Geometric mean over 10 runs using non-keyed implementation of <a href="https://github.com/krausest/js-framework-benchmark">js-framework-benchmark</a> (run locally).
          </footer>
        </div>
        <p>
          Raw speed is nice but isn't enough to prevent (or fix) the serious <a href="/read/performance">performance</a> issues which hit frontend.
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
          RedRunner <i>generates</i> very simple DOM code from the directives in your HTML.
          You can tell <i>exactly</i> how and when each individual DOM element will be updated.
        </p>
        <p>
          Simple code = less confusion = quicker development.
        </p>
      </div>
    </div>
    <div class="pure-u-1 pure-u-sm-1-2">
      <div class="info__block">
      <h2>Powerful</h2>
        <p>
          Most frameworks give you little control over how they update the DOM, which makes fixing performance issues very difficult.
        </p>
        <p>
          How RedRunner solves this will blow you socks off.
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