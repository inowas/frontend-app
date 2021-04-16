import { AdvancedCsvUpload } from '../../../shared/simpleTools/upload';
import { Button } from 'semantic-ui-react';
import { IPropertyValueObject } from '../../../../core/model/types';
import { TColumns } from '../../../shared/simpleTools/upload/AdvancedCsvUpload';
import React, { useState } from 'react';

interface IProps {
  columns: TColumns;
  onChange: (value: IPropertyValueObject[]) => void;
}

const CsvUpload = ({ columns, onChange }: IProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleCancelUpload = () => setShowModal(false);

  const handleClickUpload = () => setShowModal(true);

  const handleChange = (r: any[][]) => {
    const collection = r.map((row) => {
      const obj: { [key: string]: any } = {};
      columns.forEach((c, k2) => {
        if (row[k2] && (typeof row[k2] === 'string' || typeof row[k2] === 'number')) {
          obj[c.value] = row[k2];
        }
      });
      return obj;
    });
    onChange(collection);
  };

  return (
    <React.Fragment>
      <Button icon="upload" onClick={handleClickUpload} positive />
      {showModal && <AdvancedCsvUpload columns={columns} onSave={handleChange} onCancel={handleCancelUpload} />}
    </React.Fragment>
  );
};

export default CsvUpload;
