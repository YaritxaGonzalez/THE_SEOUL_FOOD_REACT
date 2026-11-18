import { Table as BootstrapTable } from 'react-bootstrap';

function Table({ children, ...props }) {
  return <BootstrapTable {...props}>{children}</BootstrapTable>;
}

Table.Head = ({ children, ...props }) => <thead {...props}>{children}</thead>;
Table.Body = ({ children, ...props }) => <tbody {...props}>{children}</tbody>;
Table.Row = ({ children, ...props }) => <tr {...props}>{children}</tr>;
Table.HeaderCell = ({ children, ...props }) => <th {...props}>{children}</th>;
Table.Cell = ({ children, ...props }) => <td {...props}>{children}</td>;

export default Table;