import { FlowResults } from '../../modflow/components/content/results';
import { IRootReducer } from '../../../reducers';
import { useSelector } from 'react-redux';
import React from 'react';

interface IProps {
  property: string;
}

const RTModellingResults = (props: IProps) => {
  const T20 = useSelector((state: IRootReducer) => state.T20);

  return (
    <FlowResults reducer={T20} />
  );
};

export default RTModellingResults;
