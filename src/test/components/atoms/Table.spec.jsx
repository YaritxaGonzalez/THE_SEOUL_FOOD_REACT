import { render, screen } from '@testing-library/react';
import Table from '../../../components/atoms/Table';

describe('Table', () => {
  it('renderiza encabezados y celdas con la estructura de tabla', () => {
    render(
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>Nombre</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Shin Ramyeon</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
    expect(screen.getByRole('columnheader', { name: 'Nombre' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Shin Ramyeon' })).toBeInTheDocument();
  });
});