import React, {useState} from 'react';

interface IProps {
    onChange: () => void;
}

const uploadGeoJSONModal = (props: IProps) => {
    const [showModal, setShowModal] = useState<boolean>(false);


};

export default uploadGeoJSONModal;
