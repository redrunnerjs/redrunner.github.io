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
          Of course, high scores on benchmarks won't necessarily prevent or solve real world <a href="/read/performance">performance</a> issues.
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
          You can learn RedRunner in under an hour. Not just how to use it, but also how it works.
        </p>
        <p>
          RedRunner's internals are so simple you can always tell exactly how, when and why every single DOM element gets updated.
        </p>
        <p>
          The <a href="/docs/tutorial">tutorial</a> covers all you need to know.
        </p>
      </div>
    </div>
    <div class="pure-u-1 pure-u-sm-1-2">
      <div class="info__block">
        <h2>Powerful</h2>
        <p>
          Most operations include a seamless, granular and progressive manual override features.
        </p>
        <p>
          You can literraly do anything you'd want to do in a web app, all without breaking out of the framework.
        </p>
        <p>
          You can use this power to optimize <a href="/read/performance">performance</a>, <a href="/read/bundle_size">bundle size</a> or code reuse and <a href="/read/readability">readability</a>.
        </p>
        <!-- 
          You can take progressive control of any
 (data checking, DOM updates, DOM pooling etc) 

        <p>
          <b>Seamlessly</b> and <b>progressively</b> take <b>granular</b> control of any operations (data checking, DOM updates, DOM pooling etc).
        </p>
        <p>
          And you can do it in a and 
        </p>
          Raw speed is nice but won't prevent or solve performance bottlenecks - for that you need the option of control.
          The control is <b>granular</b>, so could be for one component, a class of components, certain parts of the component, individual DOM elements or certain aspects of those (e.g. manually control styles, but let RedRunner update text).
          RedRunner lets you  and <b>progressively</b> take <b>granular</b> 
        <p>
          You can integrate control <b>seamlessly</b> into the framework's operations without clashing, or feeling like you've stepped out of the framework.
        -->
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