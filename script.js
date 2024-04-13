const w = 800,
      h = 500,
      padding = 50;

const svg = d3
  .select('.scatterplot-container')
  .append('svg')
  .attr('width', w)
  .attr('height', h)
  .attr('position', 'relative');

const tooltip = d3
  .select('.scatterplot-container')
  .append('div')
  .attr('id', 'tooltip')
  .attr('class', 'tooltip')
  .style('opacity', 0)
  .style('position', 'absolute');

const color = ['#1f77b4', '#fcba03'];

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then(data => {
    console.log(typeof(data[0].Place));

    data.forEach(d => {
      d.Place = +d.Place;
      const parsedTime = d.Time.split(':');
      d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
    });

    const years = data.map(item => item.Year);
    const times = data.map(item => item.Time);

    const xScale = d3.scaleLinear()
      .domain([d3.min(years) - 1, d3.max(years) + 1])
      .range([padding, w - padding]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));

    const yScale = d3.scaleTime()
      .domain(d3.extent(times))
      .range([padding, h - padding]);

    const timeFormat = d3.timeFormat('%M:%S');
    const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);

    svg.append('g')
      .attr('transform', `translate(0, ${h - padding})`)
      .attr('id', 'x-axis')
      .call(xAxis);

    svg.append('g')
      .attr('transform', `translate(${padding}, 0)`)
      .attr('id', 'y-axis')
      .call(yAxis);

    svg.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.Year))
      .attr('cy', d => yScale(d.Time))
      .attr('r', 5)
      .attr('data-xvalue', d => d.Year)
      .attr('data-yvalue', d => d.Time)
      .style('fill', d => d.Doping === '' ? color[1] : color[0])
      .on('mouseover', (event, d) => {
        console.log(event);
        tooltip
          .style('opacity', 0.9)
          .attr('data-year', d.Year)
          .html(
            `${d.Name}: ${d.Nationality}<br/>
              Year: ${d.Year}, Time: ${d.Time.toLocaleTimeString().substring(3)}
              ${d.Doping ? `<br/><br/>${d.Doping}` : ''}`
          )
          .style('left', `${event.pageX}px`)
          .style('top', `${event.pageY}px`);
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0);
      });

    const legendContainer = svg.append('g').attr('id', 'legend');

    const legend = legendContainer
      .selectAll('#legend')
      .data(color)
      .enter()
      .append('g')
      .attr('class', 'legend-label')
      .attr('transform', (d, i) => `translate(200, ${h / 2 - i * 25})`);

    legend
      .append('rect')
      .attr('x', w - 250)
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', (d, i) => i === 0 ? color[0] : color[1]);

    legend
      .append('text')
      .attr('x', w - 260)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('font-size', 12)
      .style('text-anchor', 'end')
      .text((d, i) => i === 0 ? 'Riders with doping allegations' : 'No doping allegations');

    

    d3.select('#legend')
      .append('g')
      .attr('class', 'legend-label')

  })
  .catch(e => console.log('Error: ', e));