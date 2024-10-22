import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

const Portal = ({ children, parentElement }) => {
    const portalNodeRef = useRef(null);

    useEffect(() => {
        if (parentElement) {
            portalNodeRef.current = parentElement;

            return () => {
                portalNodeRef.current = null;
            };
        }
    }, [parentElement]);

    return portalNodeRef.current ? ReactDOM.createPortal(children, portalNodeRef.current) : null;
};

export default Portal;
