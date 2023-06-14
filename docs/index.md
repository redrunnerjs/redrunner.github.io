  template: main-no-toc.html

<div class="homepage">
  <div class="logo">
  <!--
    <div class="logo__logo">
      <img class="logo__image" src="/static/img/avatar.svg" alt="RedRunner" />
    </div>
    -->
    <div class="logo__text">
      <div class="logo__name">RedRunner</div>
      <div class="logo__slogan">A tiny framework with legs!</div>
    </div>
  </div>

  <div class="info">
    <div class="pure-g">
      <div class="pure-u-1 pure-u-sm-1-2">
        <div class="info__block">
          <h2>Size</h2>
          <p>
            RedRunner produces tiny bundles, resulting in faster page loading.
          </p>
          <div class="stats_div">
            <header>Size of identical benchmark app</header>
            <div class="stats_table" id="framework_size_chart"></div>
            <footer>
              Sizes of minified and gzipped bundle of non-keyed implementations of the <a href="https://github.com/krausest/js-framework-benchmark">js-framework-benchmark</a> app.
            </footer>
          </div>
        </div>
      </div>
      <div class="pure-u-1 pure-u-sm-1-2">
        <div class="info__block">
          <h2>Speed</h2>
          <p>
            It is also one of the fastest on benchmarks (but is actually even faster).
          </p>
          <div class="stats_div">
            <header>Results for create 10,000 rows test</header>
            <div class="stats_table" id="framework_speed_chart"></div>
            <footer>
              Geometric mean over 10 runs using non-keyed implementation of <a href="https://github.com/krausest/js-framework-benchmark">js-framework-benchmark</a> (run locally).
            </footer>
          </div>
        </div>
      </div>
    </div>
  </div>


  <div class="info">
    <div class="pure-g">
      <div class="pure-u-1 pure-u-sm-1-2">
        <div class="info__block">
          <h2>Simplicity</h2>
          <p>
            The syntax is simple, and internal operations even simpler!
            Less confusion means faster development.
          </p>
          <img src="/static/img/click-counter.png" alt="Source code of click counter component">
        </div>
      </div>
      <div class="pure-u-1 pure-u-sm-1-2">
        <div class="info__block">
        <h2>Power</h2>
          <p>
            Simple internals let you mannually override anything.
          </p>
          <img src="/static/img/wrapper.png" alt="Source code showing wrapper usage">
          <p>
            Use this to make your code clearer and leaner, or fix slow pages with selective updates.
          </p>
          <!-- 
          <p>
            Most of the time RedRunner feels like any other declarative framework, 
            but its unique design also gives you full control when you need it.
          </p>
          All of these are quite trivial:
          <ul>
            <li>Selective or partial component updates.</li>
            <li>Fine control of element updates.</li>
            <li>Optimising how DOM is recycled.</li>
          </ul>
          <p>
            This lets you fix performance issues in minutes rather than days, without making a mess of your code.
          </p>
          -->
        </div>
      </div>
    </div>
  </div>


  <div class="sub-text">
    Bonus features include a <a href="/tour#the-walrus">walrus</a>, and <a href="/tour#bubbles">bubbles</a>.
  </div>

  <div class="call-to-action">
    <a href="/tour/at-a-glance">Take the tour</a>
    <p>
      RedRunner is used on a couple of live sites, 
      but is still in active development and should not be considered production ready.
    </p>
  </div>
</div>


<script type="text/javascript">
  drawChart(frameworkStats, "createRows", "framework_speed_chart", "ms");
  drawChart(frameworkStats, "size", "framework_size_chart", " kB");
</script>