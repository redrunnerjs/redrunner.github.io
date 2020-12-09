template: main-no-toc.html

<div class="logo">
  <div class="logo__logo">
    <img class="logo__image" src="/static/img/avatar.svg" alt="RedRunner" />
  </div>
  <div class="logo__text">
    <div class="logo__name">RedRunner</div>
    <div class="logo__slogan">Tiny, fast, simple and powerful JavaScript framework.</div>
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
        <h2>Clean</h2>
        <p>
          A special <a href="/read/compiler">compiler</a> generates code from your code to allow the latter to be as lean and clean as it is possible to be without introducing custom syntax.
        </p>
        <p>
          There are some shorthand notations to save typing, but other than that it's all just lean JavaScript.
      </div>
    </div>
    <div class="pure-u-1 pure-u-sm-1-2">
      <div class="info__block">
        <h2>Clear</h2>
        <p>
          The generated code updates the DOM in a very direct and granular way using simple wrapper elements.
        </p>
        <p>
          One of the (<a href="/read/design">many</a>) advantages of this is being able to see exactly how, when and why any part of the DOM is being updated.
        </p>
      </div>
    </div>
  </div>
</div>


<div class="info">
  <div class="pure-g">
    <div class="pure-u-1 pure-u-sm-1-2">
      <div class="info__block">
        <h2>Helpful</h2>
        <p>
          RedRunner has dynamic documentation built-in.
          Just put a <code>?</code> in front of the directive you need help with:
```html
<div ? :items="todos|ToDo"></div>
```
          And a help page will pop up in your browser. It even works for <a href="/read/super-powers">custom directives</a>.
        </p>
      </div>
    </div>
    <div class="pure-u-1 pure-u-sm-1-2">
      <div class="info__block">
      <h2>Powerful</h2>
        <p>
          You can easily override virtually any behaviour, at as granular level as you like, all without stepping out of the framework, or clashing with it.
        </p>
        <p>
          And that's just one of the <a href="/read/super-powers">super powers</a> you can use to resolve performance bottlenecks, improve code structure, or anything else.
        </p>
      </div>
    </div>
  </div>
</div>

<script>

  /**
   * Script to draw the little stats tables.
   * 
   * Get stats from https://github.com/krausest/js-framework-benchmark (non-keyed)
   */
  var frameworkStats = [
    { framework: 'angular', createRows: 2354, size: 38.26 },
    { framework: 'inferno', createRows: 1800, size: 8.9 },
    { framework: 'react', createRows: 2886, size: 38.33 },
    { framework: 'redrunner', createRows: 1846, size: 3.8 },
    { framework: 'riot', createRows: 2263, size: 7.23 },
    { framework: 'svelte', createRows: 2167, size: 2.96 },
    { framework: 'vanillajs', createRows: 1653, size: 2.17 },
    { framework: 'vue-next', createRows: 1967, size: 20.3 }
  ];

  function dynamicSort(property) {
    return function (a, b) {
      return a[property] < b[property] ? -1 : (a[property] > b[property] ? 1 : 0);
    }
  }

  function calcPercentage(partialValue, totalValue) {
    return Math.round((100 * partialValue) / totalValue);
  } 

  function drawChart(data, key, divId, unit) {
    var sorted = data.sort(dynamicSort(key));
    var highest = sorted[sorted.length - 1][key];

    console.log(highest)
    var table = '<table class="stats-table"><tbody>';
    sorted.forEach(function(entry) {
      console.log(entry)
      var percentage = calcPercentage(entry[key], highest);
      var percentageBar = '<div class="percentage-bar" style="width:' + percentage + '%;"></div>';
      var percentageBarContainer = '<div class="percentage-bar-container">' + percentageBar + '</div>';
      var frameworkTd = '<td>'  + entry.framework + '</td>';
      var percentageTd = '<td>'  + percentageBarContainer + '</td>';
      var valueTd = '<td>' + entry[key] + unit + '</td>';
      var row = '<tr class="stats-row">' + frameworkTd + percentageTd + valueTd + '</tr>';
      table += row;
    })
    table += '</tbody></table>'
    var div = document.getElementById(divId);
    div.innerHTML = table;
  }

  drawChart(frameworkStats, "createRows", "framework_speed_chart", "ms")
  drawChart(frameworkStats, "size", "framework_size_chart", " kB")

</script>