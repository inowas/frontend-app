import {Divider, DropdownProps, Form, Segment} from 'semantic-ui-react';
import {IRootReducer} from '../../../../reducers';
import {useSelector} from 'react-redux';
import MedianInflowConcentration from './MedianInflowConcentration';
import React, {SyntheticEvent, useState} from 'react';
import _ from 'lodash';

const StatsTotal = () => {
  const [selectedKeys, setSelectedKeys] = useState<any[]>([]);
  const [selectedSchemes, setSelectedSchemes] = useState<any[]>([]);

  const T15 = useSelector((state: IRootReducer) => state.T15);
  const config = T15.qmra ? T15.qmra.data : null;
  const results = T15.results;

  if (!config || !results) {
    return null;
  }

  const handleChangeSelect = (e: SyntheticEvent<HTMLElement>, {name, value}: DropdownProps) => {
    if (Array.isArray(value)) {
      if (name === 'keys') {
        setSelectedKeys(value);
      }
      if (name === 'schemes') {
        setSelectedSchemes(value);
      }
    }
  };

  const renderDropdown = () => {
    const keys = _.uniq(results.stats_total.map((s) => s.key));

    const schemes = _.uniqBy(config.treatment.schemes, 'schemeId');

    return (
      <Form>
        <Form.Select
          placeholder="Select Schemes"
          name="schemes"
          label="Selected Schemes"
          fluid
          multiple
          selection
          options={schemes.map((s) => ({key: s.schemeId, text: s.name, value: s.schemeId}))}
          onChange={handleChangeSelect}
          value={selectedSchemes}
        />
        <Form.Select
          placeholder="Select Keys"
          name="keys"
          label="Selected Keys"
          fluid
          multiple
          selection
          options={keys.map((k) => ({key: k, text: k, value: k}))}
          onChange={handleChangeSelect}
          value={selectedKeys}
        />
      </Form>
    );
  };

  const renderTable = () => <MedianInflowConcentration data={results.stats_total.filter((r) => {
    return (
      selectedKeys.length === 0 || (selectedKeys.length > 0 && selectedKeys.includes(r.key))
    ) && (
      selectedSchemes.length === 0 || (selectedSchemes.length > 0 && selectedSchemes.includes(r.TreatmentSchemeID))
    );
  })}/>;

  return (
    <Segment color={'grey'}>
      {renderDropdown()}
      <Divider/>
      {renderTable()}
    </Segment>
  );
};

export default StatsTotal;
