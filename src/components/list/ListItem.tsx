import React from 'react';

export interface IListItemProps {
  children?: React.ReactNode;
  avatar?: React.ReactNode;
}

export function ListItem(props: IListItemProps) {
  const { children, avatar } = props;
  if (avatar) {
    return (
      <div className="list-item">
        {avatar}
        <div className="list-item-grid">{children}</div>
      </div>
    );
  }
  return <div className="list-item">{children}</div>;
}
