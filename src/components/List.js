import React from 'react';
import './List.css';

const ListComponent = ({ items, renderItem, title }) => {
  return (
    <div className="list-container">
      {title && <h2>{title}</h2>}
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {renderItem(item)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListComponent;
