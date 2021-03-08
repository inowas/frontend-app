import { IToolInstance } from '../../types';
import { asyncFetchUrl } from '../../../services/api';
import { useEffect, useState } from 'react';

const useFetchInstances = (tool: string, showPublicInstances: boolean, reload = false) => {
  const [instances, setInstances] = useState<IToolInstance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorLoading, setErrorLoading] = useState<boolean>(false);

  useEffect(
    () => {
      setIsLoading(true);
      setErrorLoading(false);

      if (!tool) {
        setErrorLoading(true);
        return;
      }

      let fetchingAttempts = 0;
      do {
        fetchingAttempts++;
        asyncFetchUrl(`tools/${tool}` + (showPublicInstances ? '?public=true' : ''))
          .then(response => response.data)
          .then(data => {
            console.log(data);
            setInstances(data);
          })
          .catch(() => {
              setErrorLoading(true);
            }
          )
          .finally(() => {
            setIsLoading(false);
          });
      } while (errorLoading && fetchingAttempts < 5);
    },
    [errorLoading, tool, showPublicInstances, reload]
  );

  return [
    isLoading as boolean,
    errorLoading as boolean,
    instances
  ];
};

export default useFetchInstances;
