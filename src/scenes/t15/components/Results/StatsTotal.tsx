import {Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis} from 'recharts';
import {Dropdown, DropdownProps, Segment, Tab} from 'semantic-ui-react';
import {IRootReducer} from '../../../../reducers';
import {useSelector} from 'react-redux';
import MedianInflowConcentration from './MedianInflowConcentration';
import React, {SyntheticEvent, useState} from 'react';
import _ from 'lodash';

const StatsTotal = () => {
  const [selectedKey, setSelectedKey] = useState<string>();

  const T15 = useSelector((state: IRootReducer) => state.T15);
  const results = T15.results;

  const handleChangeSelect = (e: SyntheticEvent<HTMLElement>, {value}: DropdownProps) => {
    if (typeof value === 'string') {
        setSelectedKey(value);
    }
  };

  if (!results) {
    return null;
  }

  const renderChart = () => {
    if (!selectedKey) {
      return null;
    }

    const data = results.stats_total.filter((t) => t.key === selectedKey).map((t) => {
      return {
        name: t.PathogenName,
        min: t.min,
        mean: t.mean,
        max: t.max
      }
    });

    return (
        <BarChart
          width={800}
          height={300}
          data={data}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="max" stackId="a" fill="#8884d8" />
          <Bar dataKey="mean" stackId="a" fill="#82ca9d" />
          <Bar dataKey="min" stackId="a" fill="#82ca9d" />
        </BarChart>
    )
  };

  const renderDropdown = () => {
    const keys = _.uniq(results.stats_total.map((s) => s.key));

    return (
      <Dropdown
        placeholder="Select Key"
        fluid
        selection
        options={keys.map((k) => ({key: k, text: k, value: k}))}
        onChange={handleChangeSelect}
        value={selectedKey}
      />
    );
  };

  const renderGraph = () => {
    return (
      <React.Fragment>
        {renderDropdown()}
        {renderChart()}
      </React.Fragment>
    );
  }

  const renderTable = () => <MedianInflowConcentration data={results.stats_total}/>;

  const panes = [
    {
      menuItem: {key: 'table', icon: 'table', content: 'Table'},
      render: renderTable
    },
    {
      menuItem: {key: 'graph', icon: 'area graph', content: 'Graph'},
      render: renderGraph
    }
  ];

  return (
    <Segment color={'grey'}>
      <Tab panes={panes} secondary={true} pointing={true}/>
    </Segment>
  );
};

export default StatsTotal;
