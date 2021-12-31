template: main-no-toc.html

<div class="logo">
 <!--
  <div class="logo__logo">
    <img class="logo__image" src="/static/img/avatar.svg" alt="RedRunner" />
  </div>
  -->
  <div class="logo__text">
    <div class="logo__name">RedRunner</div>
    <div class="logo__slogan">A tiny framework with legs</div>
  </div>
</div>

<div class="info">
  <div class="pure-g">
    <div class="pure-u-1 pure-u-sm-1-2">
      <div class="info__block">
        <h2>Fast loading</h2>
        <p>
          RedRunner pages load faster thanks to its tiny bundle sizes.
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
        <h2>Fast updates</h2>
        <p>
          RedRunner is one of the fastest frameworks according to the benchmarks.
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
        <h2>Simple syntax</h2>
        <p>
          It's seriously simple, plus there's a in-browser help system.
        </p>
        <img src="/static/img/click_counter.png">
      </div>
    </div>
    <div class="pure-u-1 pure-u-sm-1-2">
      <div class="info__block">
      <h2>Progressive control</h2>
        <p>
          Most of the time RedRunner feels like any other declarative framework, 
          but its unique design also gives you full control when you need it.
        </p>
        All of these are genuinely trivial:
        <ul>
          <li>Selective or partial component updates.</li>
          <li>Fine control of element updates.</li>
          <li>Optimising how DOM is recycled.</li>
        </ul>
        <p>
          This means you can fix performance issues in minutes rather than days, and without making a mess of your code.
        </p>
        <!--
          
          ,
          meaning you can fix performance issues in minutes rather than days, and
          even match vanilla JS speeds, without making a mess of your code.
          
        </p>

          s internal design means you can easily tweak or alter any operation:
        vMost of the time RedRunner feels like any other declarative framework, 
          but underneath the surface it works very differently.
         RedRunner converts your code into a very crude DOM updating engine.
        <p>
          One benefit of this is that errors hit you during development.
        </p>
          However it works very differently to React, Vue etc. 
        (some might say it is more a code generator than a framework) 
        This lets you do several things that aren't possible in a normal frameworks.
          Though it feels like a declarative framework, RedRunner is really a highly optimised code generator.
          And this lets you do a ton of things that are not possible in other frameworks.
        <p>
          And this lets you do a ton of things that are not possible in other frameworks.
        </p>
          RedRunner converts declarative code into optimised instructions during compilation.
          The declarative code is translated into highly optimised DOM code during compilation.
        <p>
          RedRunner has no engine. Its syntax compiles to direct DOM updates, meaning you can take as much control as you like without breaking anything.
        </p>
        <p>
          The simple architecture, lack of magic, and the ability to seamlessly take control of internal operations make for an incredibly productive workflow.
        </p>
        -->
      </div>
    </div>
  </div>
</div>

<div class="call-to-action">
  <a href="/tour">Take the tour</a>
  <p>
    (Includes a walrus, and bubbles)
  </p>
</div>


<script type="text/javascript">
  drawChart(frameworkStats, "createRows", "framework_speed_chart", "ms");
  drawChart(frameworkStats, "size", "framework_size_chart", " kB");
</script>