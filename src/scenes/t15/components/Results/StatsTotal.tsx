import {Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis} from 'recharts';
import {Divider, DropdownProps, Form, Segment, Tab} from 'semantic-ui-react';
import {IRootReducer} from '../../../../reducers';
import {useSelector} from 'react-redux';
import MedianInflowConcentration from './MedianInflowConcentration';
import React, {SyntheticEvent, useState} from 'react';
import _ from 'lodash';

const StatsTotal = () => {
  const [selectedKey, setSelectedKey] = useState<string>();
  const [selectedScheme, setSelectedScheme] = useState<number>();

  const T15 = useSelector((state: IRootReducer) => state.T15);
  const config = T15.qmra ? T15.qmra.data : null;
  const results = T15.results;

  if (!config || !results) {
    return null;
  }

  const handleChangeKey = (e: SyntheticEvent<HTMLElement>, {value}: DropdownProps) => {
    if (typeof value === 'string') {
        setSelectedKey(value);
    }
  };

  const handleChangeScheme = (e: SyntheticEvent<HTMLElement>, {value}: DropdownProps) => {
    if (typeof value === 'number') {
      setSelectedScheme(value);
    }
  };

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

    const schemes = _.uniqBy(config.treatment.schemes, 'schemeId');

    return (
      <Form>
      <Form.Select
        placeholder="Select Scheme"
        label="Selected Scheme"
        fluid
        selection
        options={schemes.map((s) => ({key: s.schemeId, text: s.name, value: s.schemeId}))}
        onChange={handleChangeScheme}
        value={selectedScheme}
      />
        <Form.Select
          placeholder="Select Key"
          label="Selected Key"
          fluid
          selection
          options={keys.map((k) => ({key: k, text: k, value: k}))}
          onChange={handleChangeKey}
          value={selectedKey}
        />
      </Form>
    );
  };

  const renderGraph = () => {
    return (
      <React.Fragment>
        {renderChart()}
      </React.Fragment>
    );
  }

  const renderTable = () => <MedianInflowConcentration data={results.stats_total.filter((r) => {
    return !((selectedKey && r.key !== selectedKey) || (selectedScheme && r.TreatmentSchemeID !== selectedScheme));
  })}/>;

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
      {renderDropdown()}
      <Divider />
      <Tab panes={panes} secondary={true} pointing={true}/>
    </Segment>
  );
};

export default StatsTotal;
