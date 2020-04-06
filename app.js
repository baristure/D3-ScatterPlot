const tooltip = document.getElementById('tooltip');

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then(res => res.json())
  .then(res => {
  
  createStuff(res.map(r => [
    convertMinAndSec(r.Time), 
    r.Year,
    r.Doping,
    r.Name
  ]));
});

function convertMinAndSec(str) {
  return new Date(`2010 01 01 00:${str}`);
}

function createInnerHTMLForTooltip(d) {
  return `
    <p>${d[3]}(${d[1]})</p>
    <p>Time: <strong>${d[0].getMinutes()}:${d[0].getSeconds()}</strong></p>

    ${d[2] ? `<small>${d[2]}</small>` : ''}
  `;
}

function createStuff(data) {
  const width = 800;
  const height = 400;
  const padding = 40;
  
  const circleRadius = 7;
  
  const yScale = d3.scaleTime()
      .domain([d3.min(data, d => d[0]), d3.max(data, d => d[0])])
      .range([padding, height - padding]);
  
  const xScale = d3.scaleTime()
      .domain([
        d3.min(data, d => new Date(d[1] - 1)), 
        d3.max(data, d => new Date(d[1] + 1))
      ])
      .range([padding, width - padding]);
  
  console.log(d3.max(data, d => d[1]));
  
  
  const svg = d3.select('#container').append('svg')
          .attr('width', width)
          .attr('height', height);
  
  // create the graph
  svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('data-xvalue', d => d[1])
    .attr('data-yvalue', d => d[0])
    .attr('cx', d => xScale(d[1]))
    .attr('cy', d => yScale(d[0]))
    .attr('fill', d => d[2] === '' ? 'yellowgreen' : 'firebrick')
    .attr('stroke', 'black')
    .attr('r', circleRadius)
    .on('mouseover', (d, i) => {
      tooltip.classList.add('show');
      tooltip.style.left = xScale(d[1]) + 10 + 'px';
      tooltip.style.top = yScale(d[0]) - 10 + 'px';
      tooltip.setAttribute('data-year', d[1])

      tooltip.innerHTML = createInnerHTMLForTooltip(d);
  }).on('mouseout', () => {
     tooltip.classList.remove('show');
  });
  
  // format the data
  const timeFormatForMinAndSec = d3.timeFormat("%M:%S");
  const timeFormatForYear = d3.format("d");
  
  // create axis
  const xAxis = d3.axisBottom(xScale)
    .tickFormat(timeFormatForYear)
  const yAxis = d3.axisLeft(yScale)
    .tickFormat(timeFormatForMinAndSec)
  
  svg.append('g')
    .attr('id', 'x-axis')
    .attr('transform', `translate(0, ${height - padding})`)
    .call(xAxis);
  
  svg.append('g')
    .attr('id', 'y-axis')
    .attr('transform', `translate(${padding}, 0)`)
    .call(yAxis)
}